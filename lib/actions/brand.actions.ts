"use server";

import { BrandParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Brand from "../database/models/brand.model";

export const createBrand = async (params: BrandParams) => {
  try {
    await connectToDatabase();
    const newBrand = await Brand.create(params);
    return JSON.parse(JSON.stringify(newBrand));
  } catch (error) {
    handleError(error);
  }
};

export const getAllBrands = async () => {
  try {
    await connectToDatabase();

    const brands = await Brand.find().lean();

    return JSON.parse(JSON.stringify(brands));
  } catch (error) {
    handleError(error);
  }
};

export const deleteBrand = async (brandId: string) => {
  try {
    await connectToDatabase();

    const deletedBrand = await Brand.findByIdAndDelete(brandId);

    if (!deletedBrand) {
      throw new Error("Brand not found");
    }

    return { message: "Brand deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const getBrandById = async (brandId: string) => {
  try {
    await connectToDatabase();

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return null;
    }

    return JSON.parse(JSON.stringify(brand));
  } catch (error) {
    handleError(error);
  }
};

export const updateBrand = async (
  brandId: string,
  updateData: Partial<BrandParams>
) => {
  try {
    await connectToDatabase();

    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      throw new Error("Brand not found");
    }

    return JSON.parse(JSON.stringify(updatedBrand));
  } catch (error) {
    handleError(error);
  }
};



