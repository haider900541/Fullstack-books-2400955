"use client";

import { useState, useMemo } from "react";
import {
  deleteOrder,
  updateOrderDetails,
  updateOrderStatus,
} from "@/lib/actions/order.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

const statusStyleMap: Record<string, string> = {
  Pending: "text-yellow-600 border-yellow-400 bg-yellow-50",
  Confirmed: "text-blue-600 border-blue-400 bg-blue-50",
  Shipped: "text-indigo-600 border-indigo-400 bg-indigo-50",
  Delivered: "text-green-600 border-green-400 bg-green-50",
  Cancelled: "text-red-600 border-red-400 bg-red-50",
  Returned: "text-pink-600 border-pink-400 bg-pink-50",
};

type Order = {
  _id: string;
  orderId: string;
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
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: Date;

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

  createdAt: string;
};

const ClientOrderTable = ({
  orders,
  isAdmin,
}: {
  orders: Order[];
  isAdmin: boolean;
}) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [userRefundReason, setUserRefundReason] = useState("");
  const [showRefundReasonInput, setShowRefundReasonInput] = useState(false);
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState<
    string | null
  >(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await deleteOrder(orderId);
      if (response) toast.success(response.message);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by order ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full md:w-1/2 lg:w-1/3 rounded-2xl"
      />

      <Table className="bg-orange-50 hover:bg-orange-100 rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order, index) => (
            <TableRow key={order._id} className="hover:bg-orange-100">
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                <a
                  href={`/orders/${order._id}`}
                  className="text-blue-600 underline"
                >
                  {order.orderId}
                </a>
              </TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{order.customer.number}</TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                {isAdmin ? (
                  <div
                    className={`inline-block rounded px-2 py-1 text-sm font-medium border ${
                      statusStyleMap[order.orderStatus || "N/A"] ||
                      "text-gray-600 border-gray-300"
                    }`}
                  >
                    <select
                      value={order.orderStatus}
                      onChange={async (e) => {
                        const res = await updateOrderStatus(
                          order._id,
                          e.target.value
                        );
                        toast[res.success ? "success" : "error"](res.message);
                        router.refresh();
                      }}
                      className="bg-transparent appearance-none outline-none text-inherit"
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="text-black"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span
                    className={`inline-block rounded px-2 py-1 text-sm font-medium ${
                      statusStyleMap[order.orderStatus || "N/A"] ||
                      "text-gray-600"
                    }`}
                  >
                    {order.orderStatus || "N/A"}
                  </span>
                )}
              </TableCell>

              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell className="flex space-x-2">
                {!isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className={
                        order.isRefundRequested
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }
                      title={
                        order.isRefundRequested
                          ? "Cancel Refund Request"
                          : "Request Refund"
                      }
                      disabled={order.orderStatus !== "Cancelled"}
                      onClick={() => {
                        if (!order.isRefundRequested) {
                          setSelectedRefundOrderId(order._id);
                          setShowRefundReasonInput(true);
                        } else {
                          // cancel refund request
                          updateOrderDetails(order._id, {
                            isRefundRequested: false,
                            refundStatus: "None",
                            returnReason: "",
                          }).then((res) => {
                            toast[res.success ? "success" : "error"](
                              "Refund request cancelled!"
                            );
                            router.refresh();
                          });
                        }
                      }}
                    >
                      <RefreshCw />{" "}
                      {order.isRefundRequested
                        ? "Cancel Refund"
                        : "Request Refund"}
                    </Button>
                  </>
                )}

                {(order.orderStatus === "Pending" || isAdmin) && (
                  <>
                    <Button
                      onClick={() => setConfirmDeleteId(order._id)}
                      variant="outline"
                      className="text-red-500"
                      size="icon"
                      title="Delete Order"
                    >
                      <Trash size={16} />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">
          Showing {Math.min(itemsPerPage * currentPage, filteredOrders.length)}{" "}
          of {filteredOrders.length} orders
        </span>
        <div className="flex items-center space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            size="sm"
          >
            Previous
          </Button>
          <Button
            disabled={
              currentPage === Math.ceil(filteredOrders.length / itemsPerPage)
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md space-y-4 max-w-sm w-full">
            <p className="text-lg font-semibold">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteOrder(confirmDeleteId)}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRefundReasonInput && selectedRefundOrderId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md space-y-4 max-w-md w-full">
            <p className="text-lg font-semibold">Request Refund</p>
            <textarea
              rows={4}
              className="w-full border rounded p-2"
              placeholder="Please provide the reason for refund..."
              value={userRefundReason}
              onChange={(e) => setUserRefundReason(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setShowRefundReasonInput(false);
                  setUserRefundReason("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const res = await updateOrderDetails(selectedRefundOrderId, {
                    isRefundRequested: true,
                    refundStatus: "Requested",
                    returnReason: userRefundReason,
                  });
                  toast[res.success ? "success" : "error"](
                    "Refund request submitted!"
                  );
                  setShowRefundReasonInput(false);
                  setUserRefundReason("");
                  setSelectedRefundOrderId(null);
                  router.refresh();
                }}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientOrderTable;
