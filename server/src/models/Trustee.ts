import { Schema, model, InferSchemaType } from "mongoose";

const trusteeSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, default: "/user.jpg" },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TrusteeDocument = InferSchemaType<typeof trusteeSchema> & { _id: string };

export const Trustee = model("Trustee", trusteeSchema);
