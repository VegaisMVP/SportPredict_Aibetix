from fastapi import FastAPI, Request
import httpx
import os

app = FastAPI()

# External AI inference service address (can be configured via environment variable)
AI_BACKEND_URL = os.getenv("AI_BACKEND_URL", "https://your-actual-ai-backend")

@app.post("/predict-match")
async def predict_match(request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{AI_BACKEND_URL}/predict-match", json=data)
        return resp.json()

@app.post("/betting-advice")
async def betting_advice(request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{AI_BACKEND_URL}/betting-advice", json=data)
        return resp.json()

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{AI_BACKEND_URL}/chat", json=data)
        return resp.json() 