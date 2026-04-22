import { Schema, model, InferSchemaType } from "mongoose";

const studentSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export type StudentSectionDocument = InferSchemaType<typeof studentSectionSchema> & {
  _id: string;
};

export const StudentSection = model("StudentSection", studentSectionSchema);
