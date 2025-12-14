import { Document, Schema, Types, model, models } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderId?: string;
  customer: {
    name: string;
    district: string;
    address: string;
    areaOfDelivery: string;
    number: string;
    email: string;
  };
  products: {
    productId: string;
    title: string;
    images: string;
    price: number;
    sellingPrice?: number;
    quantity: number;
    category: string;
    brand?: string;
    sku: string;
    variations?: {
      name: string;
      value: string;
    }[];
  }[];
  totalAmount: string;
  advancePaid?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId: string;

  orderStatus?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  courier?: string;
  estimatedDeliveryDate?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;

  isRefundRequested?: boolean;
  refundStatus?: string;
  returnReason?: string;

  email: string;

  note?: string;
  adminNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true },
    customer: {
      name: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
      areaOfDelivery: { type: String, required: true },
      number: { type: String, required: true },
      email: { type: String, required: true },
    },
    products: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        images: { type: String, required: true },
        price: { type: Number, required: true },
        sellingPrice: { type: Number },
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
      },
    ],
    totalAmount: { type: String, required: true },

    // Payment
    advancePaid: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "Pending" },
    paymentMethod: { type: String },
    transactionId: { type: String, required: true },

    // Order & Shipping
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    shippingMethod: { type: String },
    trackingNumber: { type: String },
    courier: { type: String },
    estimatedDeliveryDate: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },

    // Refunds/Returns
    isRefundRequested: { type: Boolean, default: false },
    refundStatus: {
      type: String,
      enum: ["None", "Requested", "Approved", "Rejected", "Refunded"],
      default: "None",
    },
    returnReason: { type: String },

    // Dropshipping
    email: { type: String, required: true },

    // Communication
    note: { type: String },
    adminNote: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
