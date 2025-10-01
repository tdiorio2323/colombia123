import mongoose from "mongoose";

export async function connectMongo(uri) {
  if (!uri) throw new Error("MONGODB_URI is missing");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { maxPoolSize: 10 });
  return mongoose.connection;
}
