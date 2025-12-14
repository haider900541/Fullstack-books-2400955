import { Document, Schema, Types, model, models } from "mongoose";

export interface IBrand extends Document {
  _id: Types.ObjectId;
  title: string;
}

const BrandSchema = new Schema<IBrand>(
  {
    title: { type: String, required: true, unique: true },
  },
);

const Brand = models.Brand || model<IBrand>("Brand", BrandSchema);

export default Brand;
