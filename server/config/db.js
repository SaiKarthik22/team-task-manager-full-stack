import mongoose from "mongoose";

const getMongoUri = () =>
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URL;

export const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MongoDB connection string is required. Set MONGO_URI, MONGODB_URI, MONGO_URL, or DATABASE_URL in your environment variables."
    );
  }

  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};
