import { Request, Response } from 'express';
import { Types } from 'mongoose';
import formidable from 'formidable';
import asyncHandler from '../middlewares/asyncHandler';
import Product from '../models/productModel';

// Define interfaces
interface ProductFields {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  quantity: number;
  brand: string;
  [key: string]: any; // Index signature for formidable fields
}

interface ReviewFields {
  rating: number;
  comment: string;
}

interface FilterQuery {
  checked: string[];
  radio: number[];
}

// Extend Express Request interface to include custom properties
interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    username: string;
  };
  fields?: formidable.Fields;
}

// Interface for Review
interface IReview {
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
}

// Controller functions
const addProduct = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fields = req.fields as unknown as ProductFields;
    const { name, description, price, category, quantity, brand } = fields;

    // Validation using if statements instead of switch
    if (!name) {
      res.json({ error: "Name is required" });
      return;
    }
    if (!brand) {
      res.json({ error: "Brand is required" });
      return;
    }
    if (!description) {
      res.json({ error: "Description is required" });
      return;
    }
    if (!price) {
      res.json({ error: "Price is required" });
      return;
    }
    if (!category) {
      res.json({ error: "Category is required" });
      return;
    }
    if (!quantity) {
      res.json({ error: "Quantity is required" });
      return;
    }

    const product = new Product({ ...fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

const updateProductDetails = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fields = req.fields as unknown as ProductFields;
    const { name, description, price, category, quantity, brand } = fields;

    // Validation using if statements
    if (!name) {
      res.json({ error: "Name is required" });
      return;
    }
    if (!brand) {
      res.json({ error: "Brand is required" });
      return;
    }
    if (!description) {
      res.json({ error: "Description is required" });
      return;
    }
    if (!price) {
      res.json({ error: "Price is required" });
      return;
    }
    if (!category) {
      res.json({ error: "Category is required" });
      return;
    }
    if (!quantity) {
      res.json({ error: "Quantity is required" });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...fields },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

const removeProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment }: ReviewFields = req.body;
    const product = await Product.findById(req.params.id);

    if (product && req.user) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user?._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review: IReview = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found or user not authenticated");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

const fetchTopProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

const fetchNewProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

const filterProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { checked, radio }: FilterQuery = req.body;

    let args: Record<string, any> = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};