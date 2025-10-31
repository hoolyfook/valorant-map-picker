from fastapi import FastAPI, HTTPException, Response, Request
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

origins = [
    "http://localhost:5173",
    "https://austere-kent-transmarginal.ngrok-free.dev",
    "https://ascendible-jaime-snapless.ngrok-free.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuthRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    discordId: str | None = None

@app.post("/register")
def register(body: RegisterRequest):
    # Check for duplicate username
    if users.find_one({"username": body.username}):
        raise HTTPException(400, "Tên đăng nhập đã tồn tại")

    # Check for duplicate discordId if provided
    if body.discordId and users.find_one({"discordId": body.discordId}):
        raise HTTPException(400, "Discord ID đã được sử dụng")

    users.insert_one({
        "username": body.username,
        "password": body.password,
        "discordId": body.discordId
    })
    return {"message": "Registered successfully!"}

@app.post("/login")
def login(body: AuthRequest, response: Response):
    user = users.find_one({"username": body.username, "password": body.password})
    if not user:
        raise HTTPException(401, "Invalid credentials")

    # Set a cookie with the username (HTTP-only for security)
    response.set_cookie(
        key="username",
        value=body.username,
        httponly=True,
        samesite="none",   # Cho phép gửi cookie cross-domain
        secure=True        # Bắt buộc khi samesite="none"
    )

    return {"message": "Logged in!"}

@app.post("/save_picks")
def save_picks(results: dict, request: Request):
    username = request.cookies.get("username")
    if not username:
        raise HTTPException(401, "Not authenticated")

    user = users.find_one({"username": username})
    discord_id = user.get("discordId") if user else None

    picks.update_one(
        {"username": username},
        {"$set": {**results, "username": username, "discordId": discord_id, "updated_at": datetime.utcnow()}},
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
