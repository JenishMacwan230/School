import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  grade: number;
  enrollmentDate: Date;
  active: boolean;
}

const StudentSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      maxlength: [60, 'First name cannot be more than 60 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      maxlength: [60, 'Last name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    grade: {
      type: Number,
      required: [true, 'Please provide a grade'],
      min: [1, 'Grade must be at least 1'],
      max: [12, 'Grade cannot be more than 12'],
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
