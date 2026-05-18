import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "moviestream";

let client;
let db;

export async function connectDb() {
  if (db) {
    return db;
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected");
  }

  return db;
}

export function toObjectId(id) {
  return new ObjectId(id);
}

export function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}