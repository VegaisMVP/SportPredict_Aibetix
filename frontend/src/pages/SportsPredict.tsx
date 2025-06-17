import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { api, endpoints } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import MatchList from '../components/SportsPredict/MatchList'
import MatchDetail from '../components/SportsPredict/MatchDetail'
import UserProfile from '../components/SportsPredict/UserProfile'

const SportsPredict: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished'>('upcoming')

  const { data: matches, isLoading } = useQuery(
    ['matches', activeTab],
    () => api.get(endpoints.matches, { params: { status: activeTab } }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sports Predict</h1>
          <p className="text-gray-600 mt-2">
            AI-powered sports predictions and betting strategies
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-sm text-gray-600">
              Daily views: {user.dailyViews}/{user.maxDailyViews}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming Matches
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'finished'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Finished Matches
          </button>
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <MatchList 
              matches={matches?.data || []} 
              isLoading={isLoading}
              activeTab={activeTab}
            />
          } 
        />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  )
}

export default SportsPredict 