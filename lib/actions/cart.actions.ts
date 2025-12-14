"use server";

import { CartParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Cart from "../database/models/cart.model";

export const addToCart = async (params: CartParams) => {
  try {
    await connectToDatabase();
    const newCart = await Cart.create(params);
    return JSON.parse(JSON.stringify(newCart));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCarts = async () => {
  try {
    await connectToDatabase();

    const carts = await Cart.find().lean();

    return JSON.parse(JSON.stringify(carts));
  } catch (error) {
    handleError(error);
  }
};

export const getCartsByEmail = async (email: string) => {
  try {
    await connectToDatabase();
    const carts = await Cart.find({ email });
    return JSON.parse(JSON.stringify(carts));
  } catch (error) {
    handleError(error);
  }
};

export const updateCart = async (
  cartId: string,
  updateData: Partial<CartParams>
) => {
  try {
    await connectToDatabase();

    const updatedCart = await Cart.findByIdAndUpdate(cartId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCart) {
      throw new Error("Cart not found");
    }

    return JSON.parse(JSON.stringify(updatedCart));
  } catch (error) {
    handleError(error);
  }
};

export const deleteCart = async (cartId: string) => {
  try {
    await connectToDatabase();

    const deletedCart = await Cart.findByIdAndDelete(cartId);

    if (!deletedCart) {
      throw new Error("Cart not found");
    }

    return { message: "Cart deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const deleteCartsByEmail = async (email: string) => {
  try {
    const res = await Cart.deleteMany({ email });
    return res;
  } catch (error) {
    console.error("Error deleting carts:", error);
    throw error;
  }
};
