"use server";

import { CategoryParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";

export const createCategory = async (params: CategoryParams) => {
  try {
    await connectToDatabase();
    const newCategory = await Category.create(params);
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Category.find().lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await connectToDatabase();

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      throw new Error("Category not found");
    }

    return { message: "Category deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    await connectToDatabase();

    const category = await Category.findById(categoryId);

    if (!category) {
      return null;
    }

    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    handleError(error);
  }
};

export const updateCategory = async (
  categoryId: string,
  updateData: Partial<CategoryParams>
) => {
  try {
    await connectToDatabase();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return JSON.parse(JSON.stringify(updatedCategory));
  } catch (error) {
    handleError(error);
  }
};





