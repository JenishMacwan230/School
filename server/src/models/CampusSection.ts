import { Schema, model, InferSchemaType } from "mongoose";

const campusSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CampusSectionDocument = InferSchemaType<typeof campusSectionSchema> & {
  _id: string;
};

export const CampusSection = model("CampusSection", campusSectionSchema);
