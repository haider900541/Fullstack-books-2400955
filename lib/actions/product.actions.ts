"use server";

import { ProductParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Product, { IProduct } from "../database/models/product.model";

// --------------------------------------------
// CREATE PRODUCT
// --------------------------------------------
export const createProduct = async (params: ProductParams): Promise<IProduct | undefined> => {
  try {
    await connectToDatabase();
    const newProduct = await Product.create({ ...params });
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error) {
    handleError(error);
  }
};

// --------------------------------------------
// GET ALL PRODUCTS — LOCAL ONLY
// --------------------------------------------
export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).lean<IProduct[]>();
    return products;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// --------------------------------------------
// GET PRODUCT BY ID — LOCAL ONLY
// --------------------------------------------
export const getProductById = async (productId: string): Promise<IProduct | null> => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId).lean<IProduct>().exec();
    return product || null;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// --------------------------------------------
// FILTERED PRODUCTS — LOCAL ONLY
// --------------------------------------------
export const getFilteredProducts = async ({
  search = "",
  category = "",
  subCategory = "",
  minPrice = NaN,
  maxPrice = NaN,
  sort = null,
  page = 1,
  limit = 32,
}: {
  search?: string;
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "lowToHigh" | "highToLow" | null;
  page?: number;
  limit?: number;
}): Promise<{ products: IProduct[]; totalCount: number }> => {
  await connectToDatabase();
  let products = await Product.find().lean<IProduct[]>();

  if (search.trim()) {
    const terms = search.toLowerCase().split(/\s+/);
    products = products.filter((p) =>
      terms.every((t) =>
        [p.title, p.sku, p.brand, p.category, ...(p.subCategory || [])]
          .join(" ")
          .toLowerCase()
          .includes(t)
      )
    );
  }

  if (category) {
    const cats = category.split(",");
    products = products.filter((p) => cats.includes(p.category));
  }

  if (subCategory) {
    const subs = subCategory.split(",");
    products = products.filter((p) =>
      (p.subCategory || []).some((sc) => subs.includes(sc))
    );
  }

  products = products.filter((p) => {
    const price = Number(p.price);
    if (!isNaN(minPrice) && price < minPrice) return false;
    if (!isNaN(maxPrice) && price > maxPrice) return false;
    return true;
  });

  if (sort === "lowToHigh") {
    products.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "highToLow") {
    products.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    products.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const totalCount = products.length;
  const paginated = products.slice((page - 1) * limit, page * limit);

  return { products: paginated, totalCount };
};

// --------------------------------------------
// GET BY SUB-CATEGORY — LOCAL ONLY
// --------------------------------------------
export const getProductsBySubCategory = async (subCategory: string): Promise<IProduct[]> => {
  try {
    await connectToDatabase();
    const products = await Product.find({ subCategory })
      .sort({ createdAt: -1 })
      .lean<IProduct[]>();
    return products;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// --------------------------------------------
// UPDATE PRODUCT
// --------------------------------------------
export const updateProduct = async (
  productId: string,
  updateData: Partial<ProductParams>
): Promise<IProduct | undefined> => {
  try {
    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error("Product not found");
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    handleError(error);
  }
};

// --------------------------------------------
// DECREASE STOCK
// --------------------------------------------
export const decreaseProductQuantity = async (
  productId: string,
  orderedQuantity: number
): Promise<IProduct | undefined> => {
  try {
    await connectToDatabase();
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const current = Number(product.stock);
    if (isNaN(current)) throw new Error("Invalid stock value");
    if (current <= 0) throw new Error("Out of stock");

    product.stock = Math.max(0, current - orderedQuantity).toString();
    const updated = await product.save();
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    handleError(error);
  }
};

// --------------------------------------------
// SEARCH — LOCAL ONLY
// --------------------------------------------
export const searchProducts = async (query: string): Promise<IProduct[]> => {
  if (!query) return [];
  try {
    const regex = new RegExp(query, "i");
    const products = await getAllProducts();
    return products.filter((p) => regex.test(p.title)).slice(0, 10);
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

// --------------------------------------------
// DELETE PRODUCT
// --------------------------------------------
export const deleteProduct = async (productId: string): Promise<{ message: string } | undefined> => {
  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) throw new Error("Product not found");
    return { message: "Product deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
