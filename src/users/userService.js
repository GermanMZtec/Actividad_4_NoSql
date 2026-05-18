import { getDb, isValidObjectId, toObjectId } from "../db/mongo.js";

function toUserView(user) {
  return {
    ...user,
    _id: user._id.toString(),
    demographics: user.demographics || {},
    survey: user.survey || {}
  };
}

function parseAge(value) {
  const age = Number.parseInt(value, 10);
  return Number.isNaN(age) ? null : age;
}

function parseRating(value) {
  const rating = Number.parseInt(value, 10);
  return Number.isNaN(rating) ? 0 : rating;
}

function parseBoolean(value) {
  return value === "true" || value === true;
}

function buildUserDocument(body) {
  return {
    firstName: String(body.firstName || "").trim(),
    lastName: String(body.lastName || "").trim(),
    email: String(body.email || "").trim(),
    demographics: {
      age: parseAge(body.age),
      education: String(body.education || "").trim(),
      incomeLevel: String(body.incomeLevel || "").trim()
    },
    survey: {
      rating: parseRating(body.rating),
      wouldRecommend: parseBoolean(body.wouldRecommend)
    }
  };
}

export async function listUsers() {
  const db = getDb();
  const users = await db.collection("users").find({}).sort({ firstName: 1, lastName: 1 }).toArray();
  return users.map(toUserView);
}

export async function getUserFormData(id) {
  const db = getDb();

  if (!id) {
    return { user: null };
  }

  if (!isValidObjectId(id)) {
    return { user: null };
  }

  const user = await db.collection("users").findOne({ _id: toObjectId(id) });

  return { user: user ? toUserView(user) : null };
}

export async function createUser(body) {
  const db = getDb();
  return db.collection("users").insertOne(buildUserDocument(body));
}

export async function updateUser(id, body) {
  const db = getDb();
  return db.collection("users").updateOne({ _id: toObjectId(id) }, { $set: buildUserDocument(body) });
}

export async function deleteUser(id) {
  const db = getDb();
  return db.collection("users").deleteOne({ _id: toObjectId(id) });
}