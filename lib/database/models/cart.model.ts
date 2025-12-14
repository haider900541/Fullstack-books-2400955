import { Document, Schema, model, models } from "mongoose";

export interface ICart extends Document {
  productId: string;
  title: string;
  images: string;
  price: number;
  quantity: number;
  category: string;
  brand?: string;
  sku: string;
  variations?: {
    name: string;
    value: string;
  }[];
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    images: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    sku: { type: String, required: true },
    variations: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Cart = models.Cart || model<ICart>("Cart", CartSchema);

export default Cart;
