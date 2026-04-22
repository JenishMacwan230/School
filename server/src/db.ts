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

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const options: ConnectOptions = {};
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
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export { mongoose };
