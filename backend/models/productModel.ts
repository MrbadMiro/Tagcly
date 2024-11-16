import mongoose, { Document, Schema, Model } from 'mongoose';

// Base interfaces (without Document properties)
interface IReviewBase {
  name: string;
  rating: number;
  comment: string;
  user: mongoose.Types.ObjectId;
}

interface IProductBase {
  name: string;
  image: string;
  brand: string;
  quantity: number;
  category: mongoose.Types.ObjectId;
  description: string;
  reviews: IReviewBase[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}

// Document interfaces (with Document properties)
export interface IReview extends IReviewBase, Document {}
export interface IProduct extends IProductBase, Document {}

// Review Schema
const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Product Schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
export type { IProductBase, IReviewBase };
export default Product;