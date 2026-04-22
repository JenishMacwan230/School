import { Schema, model, InferSchemaType } from "mongoose";

const galleryItemSchema = new Schema(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export type GalleryItemDocument = InferSchemaType<typeof galleryItemSchema> & {
  _id: string;
};

export const GalleryItem = model("GalleryItem", galleryItemSchema);
