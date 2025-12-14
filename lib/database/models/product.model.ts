import { Document, Schema, Types, model, models } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  images: {
    _id: string;
    imageUrl: string;
  }[];
  price: string;
  oldPrice?: string;
  buyingPrice?: string;
  stock: string;
  category: string;
  subCategory?: string[];
  brand?: string;
  features?: string[];
  sku: string;
  variations?: {
    name: string;
    value: string;
    additionalPrice?: string;
  }[];
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [
      {
        imageUrl: { type: String },
      },
    ],
    price: { type: String, required: true },
    oldPrice: { type: String },
    buyingPrice: { type: String },
    stock: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: [{ type: String }],
    brand: { type: String },
    features: { type: [String] },
    sku: { type: String, unique: true, sparse: true },
    variations: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
        additionalPrice: { type: String },
      },
    ],
    link: { type: String },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
