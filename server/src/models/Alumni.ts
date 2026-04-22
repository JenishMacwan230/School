import { Schema, model, InferSchemaType } from "mongoose";

const alumniSchema = new Schema(
  {
    name: { type: String, required: true },
    batch: { type: String },
    profession: { type: String },
    achievement: { type: String },
    image: { type: String, default: "/user.jpg" },
  },
  { timestamps: true }
);

export type AlumniDocument = InferSchemaType<typeof alumniSchema> & { _id: string };

export const Alumni = model("Alumni", alumniSchema);
