import { ObjectId } from "mongoose";

export interface IProductReview {
  name: string;
  rating: number;
  comment: string;
  user: ObjectId;
}

export interface IProduct {
  name: string;
  image: string;
  brand: string;
  quantity: number;
  category: ObjectId;
  description: string;
  reviews: IProductReview[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}
