import { Schema, model, InferSchemaType } from "mongoose";

const sportSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SportDocument = InferSchemaType<typeof sportSchema> & { _id: string };

export const Sport = model("Sport", sportSchema);
