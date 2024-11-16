import mongoose, { Document, Schema } from "mongoose";

// Define the interface for Category
export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
});

export default mongoose.model<ICategory>("Category", categorySchema);
