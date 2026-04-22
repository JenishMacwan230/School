import { Schema, model, InferSchemaType } from "mongoose";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp_code: { type: String, required: true },
    purpose: { type: String, required: true },
    expires_at: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export type OtpDocument = InferSchemaType<typeof otpSchema> & { _id: string };

export const Otp = model("Otp", otpSchema);
