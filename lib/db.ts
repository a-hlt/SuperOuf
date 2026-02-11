import mongoose from "mongoose"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.DATABASE_URL!

if (!MONGODB_URI) {
  throw new Error("DATABASE_URL manquant dans les variables d'environnement")
}

// Mongoose connection (for our models)
const globalForMongoose = globalThis as unknown as {
  mongoosePromise: Promise<typeof mongoose> | undefined
}

export const connectDB =
  globalForMongoose.mongoosePromise ?? mongoose.connect(MONGODB_URI)

if (process.env.NODE_ENV !== "production") {
  globalForMongoose.mongoosePromise = connectDB
}

// Native MongoDB client (for Better-Auth adapter)
const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined
}

export const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(MONGODB_URI)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient
}

export const mongoDb = mongoClient.db()
