"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Trash, DollarSign, Car, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { getProductById } from "@/lib/actions/product.actions";

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

const OrderTable = ({
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
  const [productBuyingPrices, setProductBuyingPrices] = useState<
    Record<string, number>
  >({});

  // Sheet open and mode: payment | courier | refund
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"payment" | "courier" | "refund">(
    "payment"
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Temp states for payment, courier, refund
  const [tempPayment, setTempPayment] = useState({
    paymentStatus: "",
    paymentMethod: "",
    transactionId: "",
    paidAt: "",
  });

  const [tempCourier, setTempCourier] = useState({
    courier: "",
    trackingNumber: "",
    shippingMethod: "",
    estimatedDeliveryDate: "",
    shippedAt: "",
    deliveredAt: "",
    adminNote: "",
  });

  const [tempRefund, setTempRefund] = useState({
    isRefundRequested: false,
    refundStatus: "None",
    returnReason: "",
  });

  useEffect(() => {
    const fetchBuyingPrices = async () => {
      const prices: Record<string, number> = {};

      await Promise.all(
        orders.map(async (order) => {
          await Promise.all(
            order.products.map(async (product) => {
              if (!prices[product.productId]) {
                try {
                  const dbProduct = await getProductById(product.productId);
                  if (dbProduct?.buyingPrice) {
                    prices[product.productId] = parseFloat(
                      dbProduct.buyingPrice
                    );
                  }
                } catch (err) {
                  console.error(
                    "Error fetching product:",
                    product.productId,
                    err
                  );
                }
              }
            })
          );
        })
      );

      setProductBuyingPrices(prices);
    };

    fetchBuyingPrices();
  }, [orders]);

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

  const openPaymentSheet = (order: Order) => {
    setActiveOrderId(order._id);
    setSheetMode("payment");
    setTempPayment({
      paymentStatus: order.paymentStatus || "Pending",
      paymentMethod: order.paymentMethod || "",
      transactionId: order.transactionId || "",
      paidAt: order.paidAt
        ? new Date(order.paidAt).toISOString().slice(0, 10)
        : "",
    });
    setSheetOpen(true);
  };

  const openCourierSheet = (order: Order) => {
    setActiveOrderId(order._id);
    setSheetMode("courier");
    setTempCourier({
      courier: order.courier || "",
      trackingNumber: order.trackingNumber || "",
      shippingMethod: order.shippingMethod || "",
      estimatedDeliveryDate: order.estimatedDeliveryDate
        ? new Date(order.estimatedDeliveryDate).toISOString().slice(0, 10)
        : "",
      shippedAt: order.shippedAt
        ? new Date(order.shippedAt).toISOString().slice(0, 10)
        : "",
      deliveredAt: order.deliveredAt
        ? new Date(order.deliveredAt).toISOString().slice(0, 10)
        : "",
      adminNote: order.adminNote || "",
    });
    setSheetOpen(true);
  };

  const openRefundSheet = (order: Order) => {
    setActiveOrderId(order._id);
    setSheetMode("refund");
    setTempRefund({
      isRefundRequested: order.isRefundRequested || false,
      refundStatus: order.refundStatus || "None",
      returnReason: order.returnReason || "",
    });
    setSheetOpen(true);
  };

  const savePaymentInfo = async () => {
    if (!activeOrderId) return;
    const res = await updateOrderDetails(activeOrderId, {
      paymentStatus: tempPayment.paymentStatus,
      paymentMethod: tempPayment.paymentMethod,
      transactionId: tempPayment.transactionId,
      paidAt: tempPayment.paidAt ? new Date(tempPayment.paidAt) : undefined,
    });
    toast[res.success ? "success" : "error"](res.message);
    router.refresh();
    setSheetOpen(false);
  };

  const saveCourierInfo = async () => {
    if (!activeOrderId) return;
    const res = await updateOrderDetails(activeOrderId, {
      courier: tempCourier.courier,
      trackingNumber: tempCourier.trackingNumber,
      shippingMethod: tempCourier.shippingMethod,
      estimatedDeliveryDate: tempCourier.estimatedDeliveryDate
        ? new Date(tempCourier.estimatedDeliveryDate)
        : undefined,
      shippedAt: tempCourier.shippedAt
        ? new Date(tempCourier.shippedAt)
        : undefined,
      deliveredAt: tempCourier.deliveredAt
        ? new Date(tempCourier.deliveredAt)
        : undefined,
      adminNote: tempCourier.adminNote,
    });
    toast[res.success ? "success" : "error"](res.message);
    router.refresh();
    setSheetOpen(false);
  };

  const saveRefundInfo = async () => {
    if (!activeOrderId) return;
    const res = await updateOrderDetails(activeOrderId, {
      isRefundRequested: tempRefund.isRefundRequested,
      refundStatus: tempRefund.refundStatus,
      returnReason: tempRefund.returnReason,
    });
    toast[res.success ? "success" : "error"](res.message);
    router.refresh();
    setSheetOpen(false);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by customer name or order ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full md:w-1/2 lg:w-1/3"
      />

      <Table className="border border-gray-200 rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order, index) => (
            <TableRow key={order._id} className="hover:bg-gray-50">
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                <a
                  href={`/dashboard/orders/${order._id}`}
                  className="text-blue-600 underline"
                >
                  {order.orderId}
                </a>
              </TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{order.customer.number}</TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                {(() => {
                  // Calculate total cost based on fetched buying prices
                  const cost = order.products.reduce((acc, product) => {
                    const buyingPrice =
                      productBuyingPrices[product.productId] ?? 0;
                    return acc + buyingPrice * product.quantity;
                  }, 0);

                  // Total amount of the order
                  const total = parseFloat(order.totalAmount) || 0;

                  // Delivery charge based on district
                  let deliveryCharge = 0;
                  if (order.customer.district === "Dhaka") deliveryCharge = 60;
                  else deliveryCharge = 120;

                  // Profit = total amount - delivery charge - cost
                  const profit = total - deliveryCharge - cost;

                  return `$${profit.toFixed(2)}`;
                })()}
              </TableCell>

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
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="text-yellow-500"
                      size="icon"
                      onClick={() => openPaymentSheet(order)}
                      title="Edit Payment Info"
                    >
                      <DollarSign />
                    </Button>

                    <Button
                      variant="outline"
                      className="text-blue-500"
                      size="icon"
                      onClick={() => openCourierSheet(order)}
                      title="Edit Courier Info"
                    >
                      <Car />
                    </Button>
                  </>
                )}

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

                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className={
                        order.isRefundRequested
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }
                      size="icon"
                      onClick={() => openRefundSheet(order)}
                      title="Manage Refund"
                    >
                      <RefreshCw />
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

      {/* Sheet for Payment, Courier & Refund */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger className="hidden" />
        <SheetContent className="w-full max-w-md bg-white flex flex-col">
          <SheetHeader className="flex justify-between items-center">
            <SheetTitle>
              {sheetMode === "payment"
                ? "Payment Info"
                : sheetMode === "courier"
                ? "Courier Info"
                : "Refund Info"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto mt-2 px-2">
            {sheetMode === "payment" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={tempPayment.paymentStatus}
                    onChange={(e) =>
                      setTempPayment((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Method</Label>
                  <p>{tempPayment.paymentMethod}</p>
                </div>

                <div className="space-y-2">
                  <Label>Transaction ID</Label>
                  <p>{tempPayment.transactionId}</p>
                </div>
              </div>
            )}

            {sheetMode === "courier" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Courier</Label>
                  <select
                    value={tempCourier.courier}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        courier: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-1"
                  >
                    <option value="">Select Courier</option>
                    <option value="Pathao">Pathao</option>
                    <option value="Steadfast">Steadfast</option>
                    <option value="Sundarban">Sundarban</option>
                    <option value="SA Paribahan">SA Paribahan</option>
                    <option value="Paperfly">Paperfly</option>
                    <option value="RedX">RedX</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Tracking Number</Label>
                  <Input
                    value={tempCourier.trackingNumber}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        trackingNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Shipping Method</Label>
                  <select
                    value={tempCourier.shippingMethod}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        shippingMethod: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-1"
                  >
                    <option value="">Select Method</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Home Delivery">Home Delivery</option>
                    <option value="Pickup Point">Pickup Point</option>
                    <option value="Same Day">Same Day</option>
                    <option value="Next Day">Next Day</option>
                    <option value="Express">Express</option>
                    <option value="Standard">Standard</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Delivery</Label>
                  <Input
                    type="date"
                    value={tempCourier.estimatedDeliveryDate}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        estimatedDeliveryDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Shipped At</Label>
                  <Input
                    type="date"
                    value={tempCourier.shippedAt}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        shippedAt: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Delivered At</Label>
                  <Input
                    type="date"
                    value={tempCourier.deliveredAt}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        deliveredAt: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admin Note</Label>
                  <textarea
                    value={tempCourier.adminNote}
                    onChange={(e) =>
                      setTempCourier((prev) => ({
                        ...prev,
                        adminNote: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full border rounded p-2"
                    placeholder="Add any notes for this order's shipment..."
                  />
                </div>
              </div>
            )}

            {sheetMode === "refund" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded p-2">
                  <Label className="text-sm font-medium">
                    Refund Requested:
                  </Label>
                  <span
                    className={`text-sm font-semibold ${
                      tempRefund.isRefundRequested
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tempRefund.isRefundRequested ? "Yes" : "No"}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label>Refund Status</Label>
                  <select
                    value={tempRefund.refundStatus}
                    onChange={(e) =>
                      setTempRefund((prev) => ({
                        ...prev,
                        refundStatus: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-1"
                  >
                    {[
                      "None",
                      "Requested",
                      "Approved",
                      "Rejected",
                      "Refunded",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Return Reason</Label>
                  <p className="whitespace-pre-wrap">
                    {tempRefund.returnReason || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-auto">
            {sheetMode === "payment" && (
              <Button className="w-full" onClick={savePaymentInfo}>
                Save Payment Info
              </Button>
            )}
            {sheetMode === "courier" && (
              <Button className="w-full" onClick={saveCourierInfo}>
                Save Courier Info
              </Button>
            )}
            {sheetMode === "refund" && (
              <Button className="w-full" onClick={saveRefundInfo}>
                Save Refund Info
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderTable;
