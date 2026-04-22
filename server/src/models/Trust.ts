import { Schema, model, InferSchemaType } from "mongoose";

const trustSchema = new Schema(
  {
    title: { type: String, required: true },
    description1: { type: String },
    description2: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

export type TrustDocument = InferSchemaType<typeof trustSchema> & { _id: string };

export const Trust = model("Trust", trustSchema);
