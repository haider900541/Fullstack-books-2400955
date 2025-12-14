import { Document, Schema, Types, model, models } from "mongoose";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

const AdminSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
});

const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;
