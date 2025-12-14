import { Document, Schema, Types, model, models } from "mongoose";

export interface ISetting extends Document {
  _id: Types.ObjectId;
  logo: string;
  favicon: string;
  name: string;
  tagline?: string;
  description?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  facebookGroup?: string;
  youtube?: string;
  aboutUs?: string;
  returnPolicy?: string;
  termsOfService?: string;
  privacyPolicy?: string;
  registrationAmount?: string;
  deliveryCharge: {
    insideDhaka?: string;
    outSideDhaka?: string;
    PickupPoint?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    logo: { type: String, required: true },
    favicon: { type: String, required: true },
    name: { type: String, required: true },
    tagline: { type: String },
    description: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    facebookGroup: { type: String },
    youtube: { type: String },
    aboutUs: { type: String },
    returnPolicy: { type: String },
    termsOfService: { type: String },
    privacyPolicy: { type: String },
    registrationAmount: { type: String, default: 0 },
    deliveryCharge: {
      insideDhaka: { type: String, default: 0 },
      outSideDhaka: { type: String, default: 0 },
      PickupPoint: { type: String, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Setting = models.Setting || model<ISetting>("Setting", SettingSchema);

export default Setting;
