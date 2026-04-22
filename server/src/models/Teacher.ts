import { Schema, model, InferSchemaType } from "mongoose";

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    role: { type: String, required: true },
    class: { type: String, required: true },
    stream: { type: String },
    experience: { type: String },
    qualification: { type: String },
    bio: { type: String },
    photo: { type: String },
    photo_public_id: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export type TeacherDocument = InferSchemaType<typeof teacherSchema> & {
  _id: string;
};

export const Teacher = model("Teacher", teacherSchema);
