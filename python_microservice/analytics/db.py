import os
from pymongo import MongoClient

client = MongoClient(os.getenv("MONGO_URI"))
db = client["test"]

tasks_collection = db["tasks"]
users_collection = db["users"]