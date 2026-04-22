import { Schema, model, InferSchemaType } from "mongoose";

const studentStatSchema = new Schema(
  {
    total_students: { type: Number, default: 0 },
    total_classes: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type StudentStatDocument = InferSchemaType<typeof studentStatSchema> & {
  _id: string;
};

export const StudentStat = model("StudentStat", studentStatSchema);
