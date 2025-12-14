import { Document, Schema, Types, model, models } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  title: string;
}

const CategorySchema = new Schema<ICategory>({
  title: { type: String, required: true, unique: true },
});

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
