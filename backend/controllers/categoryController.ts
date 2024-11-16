import { Request, Response } from "express";
import Category from "../models/categoryModel";
import asyncHandler from "../middlewares/asyncHandler";

// TypeScript types for request body and response
interface CategoryRequest extends Request {
  body: { name?: string };
}

const createCategory = asyncHandler(async (req: CategoryRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const category = await new Category({ name }).save();
  res.json(category);
});

const updateCategory = asyncHandler(async (req: CategoryRequest, res: Response) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  category.name = name || category.name;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

const removeCategory = asyncHandler(async (req: Request, res: Response) => {
  const removed = await Category.findByIdAndDelete(req.params.categoryId);
  
  if (!removed) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.json(removed);
});

const listCategory = asyncHandler(async (req: Request, res: Response) => {
  const allCategories = await Category.find({});
  res.json(allCategories);
});

const readCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.json(category);
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
