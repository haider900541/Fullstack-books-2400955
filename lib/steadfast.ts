"use server";

import axios from "axios";
import { IOrder } from "./database/models/order.model";

const API_BASE = "https://portal.packzy.com/api/v1";

const apiKey = process.env.STEADFAST_API_KEY!;
const secretKey = process.env.STEADFAST_SECRET_KEY!;

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Api-Key": apiKey,
    "Secret-Key": secretKey,
    "Content-Type": "application/json",
  },
});

export async function createOrder(orderData: IOrder) {
  const { data } = await client.post("/create_order", orderData);
  return data;
}

export async function bulkCreateOrders(orders: IOrder[]) {
  const { data } = await client.post("/create_order/bulk-order", {
    data: orders,
  });
  return data;
}

export async function getStatusByConsignmentId(id: string) {
  const { data } = await client.get(`/status_by_cid/${id}`);
  return data;
}

export async function getStatusByInvoice(invoice: string) {
  const { data } = await client.get(`/status_by_invoice/${invoice}`);
  return data;
}

export async function getStatusByTrackingCode(trackingCode: string) {
  const { data } = await client.get(`/status_by_trackingcode/${trackingCode}`);
  return data;
}

export async function getBalance() {
  const { data } = await client.get("/get_balance");
  return data;
}

export async function createReturnRequest(payload: IOrder) {
  const { data } = await client.post("/create_return_request", payload);
  return data;
}

export async function getReturnRequest(id: string) {
  const { data } = await client.get(`/get_return_request/${id}`);
  return data;
}

export async function getReturnRequests() {
  const { data } = await client.get("/get_return_requests");
  return data;
}

export async function getCourierStatus(trackingCode: string) {
  try {
    const { data } = await client.get(
      `/status_by_trackingcode/${trackingCode}`
    );
    return data;
  } catch {
    throw new Error("Failed to fetch courier status");
  }
}
