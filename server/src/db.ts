import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    if (ret?._id) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
  },
});

mongoose.set("toObject", { virtuals: true });
mongoose.set("bufferCommands", false);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const options: ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };
  if (process.env.DB_NAME) {
    options.dbName = process.env.DB_NAME;
  }

  try {
    await mongoose.connect(mongoUri, options);
    isConnected = true;
    console.log("MongoDB connected");

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("MongoDB disconnected");
    });
  } catch (error) {
    isConnected = false;
    const maybeMongoError = error as { code?: number; codeName?: string };
    if (maybeMongoError?.code === 8000) {
      console.error(
        "MongoDB Atlas authentication failed (code 8000). Check MONGODB_URI username/password, URL encoding, and Atlas DB user permissions.",
        error
      );
    } else {
      console.error("Failed to connect to MongoDB", error);
    }
    throw error;
  }
};

export { mongoose };
