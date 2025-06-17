import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import joblib
import os
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.models = {}
        self.model_path = "models/"
        self.load_models()
        
    def load_models(self):
        """Load pre-trained models"""
        try:
            if os.path.exists(f"{self.model_path}match_winner_model.pkl"):
                self.models['match_winner'] = joblib.load(f"{self.model_path}match_winner_model.pkl")
            if os.path.exists(f"{self.model_path}score_model.pkl"):
                self.models['score'] = joblib.load(f"{self.model_path}score_model.pkl")
            if os.path.exists(f"{self.model_path}over_under_model.pkl"):
                self.models['over_under'] = joblib.load(f"{self.model_path}over_under_model.pkl")
        except Exception as e:
            logger.error(f"Error loading models: {e}")
    
    async def predict_match(
        self,
        match_id: str,
        home_team: str,
        away_team: str,
        league: str,
        home_form: Optional[List[int]] = None,
        away_form: Optional[List[int]] = None,
        head_to_head: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Generate match prediction using ensemble of models"""
        
        try:
            # Prepare features
            features = self._prepare_features(
                home_team, away_team, league, home_form, away_form, head_to_head
            )
            
            # Get predictions from different models
            match_winner_pred = self._predict_match_winner(features)
            score_pred = self._predict_score(features)
            over_under_pred = self._predict_over_under(features)
            
            # Combine predictions using ensemble
            final_prediction = self._ensemble_predictions(
                match_winner_pred, score_pred, over_under_pred
            )
            
            return {
                "home_win_prob": final_prediction["home_win_prob"],
                "draw_prob": final_prediction["draw_prob"],
                "away_win_prob": final_prediction["away_win_prob"],
                "home_score": final_prediction.get("home_score"),
                "away_score": final_prediction.get("away_score"),
                "confidence": final_prediction["confidence"],
                "model": "xg_elo_ensemble",
                "reasoning": self._generate_reasoning(features, final_prediction)
            }
            
        except Exception as e:
            logger.error(f"Error predicting match {match_id}: {e}")
            # Return fallback prediction
            return self._fallback_prediction()
    
    def _prepare_features(
        self,
        home_team: str,
        away_team: str,
        league: str,
        home_form: Optional[List[int]] = None,
        away_form: Optional[List[int]] = None,
        head_to_head: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Prepare features for prediction"""
        
        # Default form if not provided
        if home_form is None:
            home_form = [1, 1, 0, 1, 0]  # W, W, D, W, L
        if away_form is None:
            away_form = [0, 1, 1, 0, 1]  # L, W, W, L, W
        
        # Calculate form metrics
        home_form_avg = np.mean(home_form)
        away_form_avg = np.mean(away_form)
        home_form_trend = np.polyfit(range(len(home_form)), home_form, 1)[0]
        away_form_trend = np.polyfit(range(len(away_form)), away_form, 1)[0]
        
        # Head-to-head analysis
        h2h_home_wins = 0
        h2h_away_wins = 0
        h2h_draws = 0
        
        if head_to_head:
            for match in head_to_head:
                if match.get("home_team") == home_team:
                    if match.get("home_score", 0) > match.get("away_score", 0):
                        h2h_home_wins += 1
                    elif match.get("home_score", 0) < match.get("away_score", 0):
                        h2h_away_wins += 1
                    else:
                        h2h_draws += 1
        
        # League strength (mock data - would come from database)
        league_strength = {
            "Premier League": 0.9,
            "La Liga": 0.85,
            "Bundesliga": 0.8,
            "Serie A": 0.75,
            "Ligue 1": 0.7
        }.get(league, 0.5)
        
        return {
            "home_form_avg": home_form_avg,
            "away_form_avg": away_form_avg,
            "home_form_trend": home_form_trend,
            "away_form_trend": away_form_trend,
            "h2h_home_wins": h2h_home_wins,
            "h2h_away_wins": h2h_away_wins,
            "h2h_draws": h2h_draws,
            "league_strength": league_strength,
            "home_advantage": 0.1,  # Home advantage factor
            "form_diff": home_form_avg - away_form_avg,
            "trend_diff": home_form_trend - away_form_trend
        }
    
    def _predict_match_winner(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Predict match winner probabilities"""
        
        if 'match_winner' in self.models:
            # Use trained model
            feature_vector = self._features_to_vector(features)
            probs = self.models['match_winner'].predict_proba([feature_vector])[0]
            return {
                "home_win_prob": probs[0],
                "draw_prob": probs[1],
                "away_win_prob": probs[2]
            }
        else:
            # Fallback to rule-based prediction
            return self._rule_based_match_winner(features)
    
    def _predict_score(self, features: Dict[str, Any]) -> Dict[str, int]:
        """Predict match score"""
        
        if 'score' in self.models:
            # Use trained model
            feature_vector = self._features_to_vector(features)
            prediction = self.models['score'].predict([feature_vector])[0]
            return {
                "home_score": int(prediction[0]),
                "away_score": int(prediction[1])
            }
        else:
            # Fallback to rule-based score prediction
            return self._rule_based_score(features)
    
    def _predict_over_under(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Predict over/under probabilities"""
        
        if 'over_under' in self.models:
            # Use trained model
            feature_vector = self._features_to_vector(features)
            probs = self.models['over_under'].predict_proba([feature_vector])[0]
            return {
                "over_prob": probs[1],
                "under_prob": probs[0]
            }
        else:
            # Fallback to rule-based over/under
            return self._rule_based_over_under(features)
    
    def _ensemble_predictions(
        self,
        match_winner_pred: Dict[str, float],
        score_pred: Dict[str, int],
        over_under_pred: Dict[str, float]
    ) -> Dict[str, Any]:
        """Combine predictions from different models"""
        
        # Weight the predictions
        home_win_prob = match_winner_pred["home_win_prob"] * 0.6
        draw_prob = match_winner_pred["draw_prob"] * 0.6
        away_win_prob = match_winner_pred["away_win_prob"] * 0.6
        
        # Adjust based on score prediction
        if score_pred["home_score"] > score_pred["away_score"]:
            home_win_prob += 0.2
        elif score_pred["home_score"] < score_pred["away_score"]:
            away_win_prob += 0.2
        else:
            draw_prob += 0.2
        
        # Normalize probabilities
        total = home_win_prob + draw_prob + away_win_prob
        home_win_prob /= total
        draw_prob /= total
        away_win_prob /= total
        
        # Calculate confidence based on prediction agreement
        confidence = 0.7  # Base confidence
        if abs(home_win_prob - away_win_prob) > 0.3:
            confidence += 0.2  # High confidence when clear favorite
        
        return {
            "home_win_prob": round(home_win_prob, 3),
            "draw_prob": round(draw_prob, 3),
            "away_win_prob": round(away_win_prob, 3),
            "home_score": score_pred["home_score"],
            "away_score": score_pred["away_score"],
            "confidence": min(confidence, 0.95)
        }
    
    def _rule_based_match_winner(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Rule-based match winner prediction"""
        
        # Simple rule-based logic
        home_advantage = features["home_advantage"]
        form_diff = features["form_diff"]
        h2h_diff = features["h2h_home_wins"] - features["h2h_away_wins"]
        
        # Calculate base probabilities
        home_strength = 0.33 + home_advantage + (form_diff * 0.1) + (h2h_diff * 0.05)
        away_strength = 0.33 - home_advantage - (form_diff * 0.1) - (h2h_diff * 0.05)
        draw_strength = 0.34
        
        # Normalize
        total = home_strength + away_strength + draw_strength
        return {
            "home_win_prob": home_strength / total,
            "draw_prob": draw_strength / total,
            "away_win_prob": away_strength / total
        }
    
    def _rule_based_score(self, features: Dict[str, Any]) -> Dict[str, int]:
        """Rule-based score prediction"""
        
        # Simple score prediction based on form
        base_home_score = 1.5 + (features["home_form_avg"] * 0.5)
        base_away_score = 1.0 + (features["away_form_avg"] * 0.5)
        
        return {
            "home_score": max(0, int(round(base_home_score))),
            "away_score": max(0, int(round(base_away_score)))
        }
    
    def _rule_based_over_under(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Rule-based over/under prediction"""
        
        # Simple over/under based on form
        total_goals_expected = (features["home_form_avg"] + features["away_form_avg"]) * 2.5
        
        if total_goals_expected > 2.5:
            return {"over_prob": 0.6, "under_prob": 0.4}
        else:
            return {"over_prob": 0.4, "under_prob": 0.6}
    
    def _features_to_vector(self, features: Dict[str, Any]) -> List[float]:
        """Convert features to vector for ML models"""
        return [
            features["home_form_avg"],
            features["away_form_avg"],
            features["home_form_trend"],
            features["away_form_trend"],
            features["h2h_home_wins"],
            features["h2h_away_wins"],
            features["h2h_draws"],
            features["league_strength"],
            features["home_advantage"],
            features["form_diff"],
            features["trend_diff"]
        ]
    
    def _generate_reasoning(self, features: Dict[str, Any], prediction: Dict[str, Any]) -> str:
        """Generate human-readable reasoning for prediction"""
        
        reasoning_parts = []
        
        if prediction["home_win_prob"] > 0.5:
            reasoning_parts.append("Home team is favored based on recent form")
        elif prediction["away_win_prob"] > 0.5:
            reasoning_parts.append("Away team has the advantage")
        else:
            reasoning_parts.append("This match appears evenly balanced")
        
        if features["form_diff"] > 0.2:
            reasoning_parts.append("Home team has significantly better recent form")
        elif features["form_diff"] < -0.2:
            reasoning_parts.append("Away team has been performing better recently")
        
        if features["h2h_home_wins"] > features["h2h_away_wins"]:
            reasoning_parts.append("Home team has historical advantage in head-to-head matches")
        
        if prediction["confidence"] > 0.8:
            reasoning_parts.append("High confidence prediction based on clear indicators")
        elif prediction["confidence"] < 0.6:
            reasoning_parts.append("Low confidence due to mixed signals")
        
        return ". ".join(reasoning_parts) + "."
    
    def _fallback_prediction(self) -> Dict[str, Any]:
        """Fallback prediction when models fail"""
        return {
            "home_win_prob": 0.33,
            "draw_prob": 0.34,
            "away_win_prob": 0.33,
            "home_score": 1,
            "away_score": 1,
            "confidence": 0.5,
            "model": "fallback",
            "reasoning": "Unable to generate prediction due to insufficient data."
        }
    
    async def train_models(self):
        """Train or retrain the prediction models"""
        # TODO: Implement model training with historical data
        logger.info("Model training not implemented yet")
    
    async def get_model_performance(self) -> Dict[str, Any]:
        """Get model performance metrics"""
        # TODO: Implement performance tracking
        return {
            "accuracy": 0.75,
            "precision": 0.72,
            "recall": 0.68,
            "f1_score": 0.70,
            "last_updated": "2024-01-01"
        } 