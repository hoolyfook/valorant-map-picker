from requests import Response, Request
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
from pydantic import BaseModel

load_dotenv()
app = FastAPI()

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["valorant"]
users = db["users"]
picks = db["picks"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class AuthRequest(BaseModel):
    username: str
    password: str

@app.post("/register")
def register(body: AuthRequest):
    if users.find_one({"username": body.username}):
        raise HTTPException(400, "User already exists")

    users.insert_one({"username": body.username, "password": body.password})
    return {"message": "Registered successfully!"}

@app.post("/login")
def login(body: AuthRequest, response: Response):
    user = users.find_one({"username": body.username, "password": body.password})
    if not user:
        raise HTTPException(401, "Invalid credentials")

    # Set a cookie with the username (HTTP-only for security)
    response.set_cookie(key="username", value=body.username, httponly=True)
    return {"message": "Logged in!"}

@app.post("/save_picks")
def save_picks(results: dict, request: Request):
    username = request.cookies.get("username")
    if not username:
        raise HTTPException(401, "Not authenticated")

    picks.update_one(
        {"username": username},
        {"$set": {**results, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    return {"message": "Picks saved!"}


@app.get("/leaderboard")
def leaderboard():
    board = list(picks.find({}, {"_id": 0}))
    board.sort(key=lambda x: x.get("updated_at", 0), reverse=True)
    return board

@app.get("/")
def root():
    return {"status": "Valorant Pick’em API OK"}
