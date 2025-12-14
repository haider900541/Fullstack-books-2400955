"use server";

import { OrderParams } from "@/types";
import { generateOrderId, handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import { Types } from "mongoose";
// ✅ Create a new order
export const createOrder = async (params: OrderParams) => {
  try {
    await connectToDatabase();
    const newOrder = await Order.create({
      ...params,
      orderId: generateOrderId(),
    });
    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get all orders
export const getAllOrders = async () => {
  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get order by ID
export const getOrderById = async (id: string) => {
  try {
    await connectToDatabase();

    // Determine which field to query
    const query = Types.ObjectId.isValid(id) ? { _id: id } : { orderId: id };

    const order = await Order.findOne(query).lean();

    return order ? JSON.parse(JSON.stringify(order)) : null;
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get orders by customer email
export const getOrdersByEmail = async (email: string) => {
  try {
    await connectToDatabase();
    const orders = await Order.find({ email }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

// ✅ Get orders by status
export const getOrdersByStatus = async (status: string) => {
  try {
    await connectToDatabase();
    const orders = await Order.find({ orderStatus: status });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

// ✅ Update order
export const updateOrder = async (
  orderId: string,
  updateData: Partial<OrderParams>
) => {
  try {
    await connectToDatabase();
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) throw new Error("Order not found");
    return JSON.parse(JSON.stringify(updatedOrder));
  } catch (error) {
    handleError(error);
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      console.log(`Order ${orderId} not found`);
      return { success: false, message: "Order not found" };
    }

    const prevStatus = order.orderStatus;
    console.log(`Previous status: ${prevStatus}, New status: ${newStatus}`);

    if (prevStatus === newStatus) {
      return { success: true, message: "Order status unchanged" };
    }

    order.orderStatus = newStatus;
    await order.save();

    return {
      success: true,
      message: "Order status and customer stats updated",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update order status" };
  }
};

// ✅ Update full order details (payment + courier info)
export const updateOrderDetails = async (
  orderId: string,
  data: {
    paymentStatus?: string;
    paymentMethod?: string;
    transactionId?: string;
    paidAt?: Date;
    courier?: string;
    trackingNumber?: string;
    shippingMethod?: string;
    estimatedDeliveryDate?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    adminNote?: string;
    isRefundRequested?: boolean;
    refundStatus?: string;
    returnReason?: string;
  }
) => {
  try {
    await connectToDatabase();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        ...(data.paymentStatus !== undefined && {
          paymentStatus: data.paymentStatus,
        }),
        ...(data.paymentMethod !== undefined && {
          paymentMethod: data.paymentMethod,
        }),
        ...(data.transactionId !== undefined && {
          transactionId: data.transactionId,
        }),
        ...(data.paidAt !== undefined && { paidAt: data.paidAt }),
        ...(data.courier !== undefined && { courier: data.courier }),
        ...(data.trackingNumber !== undefined && {
          trackingNumber: data.trackingNumber,
        }),
        ...(data.shippingMethod !== undefined && {
          shippingMethod: data.shippingMethod,
        }),
        ...(data.estimatedDeliveryDate !== undefined && {
          estimatedDeliveryDate: data.estimatedDeliveryDate,
        }),
        ...(data.shippedAt !== undefined && {
          shippedAt: data.shippedAt,
        }),
        ...(data.deliveredAt !== undefined && {
          deliveredAt: data.deliveredAt,
        }),
        ...(data.adminNote !== undefined && { adminNote: data.adminNote }),
        ...(data.isRefundRequested !== undefined && {
          isRefundRequested: data.isRefundRequested,
        }),
        ...(data.refundStatus !== undefined && {
          refundStatus: data.refundStatus,
        }),
        ...(data.returnReason !== undefined && {
          returnReason: data.returnReason,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) throw new Error("Order not found");

    return { success: true, message: "Order details updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update order details" };
  }
};

// ✅ Delete order
export const deleteOrder = async (orderId: string) => {
  try {
    await connectToDatabase();
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) throw new Error("Order not found");
    return { message: "Order deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
