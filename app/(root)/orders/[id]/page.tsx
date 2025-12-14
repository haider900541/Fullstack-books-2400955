import { getOrderById } from "@/lib/actions/order.actions";
import Image from "next/image";
import {
  BadgeCheck,
  PackageCheck,
  Truck,
  Undo2,
  StickyNote,
  CreditCard,
} from "lucide-react";
import { getSetting } from "@/lib/actions/setting.actions";
import InvoiceDownloader from "@/app/dashboard/components/InvoiceDownloader";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Product = {
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
};

const OrderDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const order = await getOrderById(id);

  const setting = await getSetting();

  if (!order) {
    return (
      <div className="px-4 py-10 text-center text-xl text-destructive">
        Order not found.
      </div>
    );
  }

  const InfoItem = ({
    label,
    value,
  }: {
    label: React.ReactNode;
    value: React.ReactNode;
  }) => (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );

  const formatDate = (date: Date | string | undefined) =>
    date ? new Date(date).toLocaleString() : "N/A";

  return (
    <section className="px-4 py-10 max-w-5xl mx-auto space-y-8">
      <div className="border rounded-xl p-6 shadow space-y-6 bg-white">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6">
          {/* Setting Info */}
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold">{setting?.name || "Shop"}</h2>
              <p className="text-sm text-gray-600">{setting?.email}</p>
              <p className="text-sm text-gray-600">{setting?.phoneNumber}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="text-right">
            <h1 className="text-4xl font-extrabold text-orange-600">INVOICE</h1>
            <p className="mt-2 text-sm">
              <span className="font-semibold">Invoice ID:</span> #
              {order.orderId || order._id}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(order.createdAt)}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Payment:</span>{" "}
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "bKash"}
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-500" /> Customer Info
            </h2>
            {[
              ["Name", order.customer.name],
              ["Email", order.customer.email],
              ["Phone", order.customer.number],
              ["District", order.customer.district],
              ["Area", order.customer.areaOfDelivery],
              ["Address", order.customer.address],
            ].map(([label, value], idx) => (
              <InfoItem key={idx} label={label} value={value} />
            ))}
          </div>

          {/* Order + Payment */}
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> Order & Payment
            </h2>
            {[
              [
                "Status",
                <Badge key="orderStatus" status={order.orderStatus} />,
              ],
              [
                "Payment Status",
                <Badge
                  key="paymentStatus"
                  status={order.paymentStatus}
                  color="green"
                />,
              ],
              [
                "Payment Method",
                <Badge
                  key="Payment Method"
                  status={
                    order.paymentMethod === "cod" ? "Cash on Delivery" : "bKash"
                  }
                  color={order.paymentMethod === "cod" ? "blue" : "pink"}
                />,
              ],
              ["TransactionId", `${order.transactionId || "N/A"}`],
              ["Advanced Paid", `$${order.advancePaid || 0}`],
              ["Total Amount", `$${order.totalAmount}`],
              [
                "Due Payment",
                `$${(order.totalAmount - (order.advancePaid || 0)).toFixed(2)}`,
              ],
            ].map(([label, value], idx) => (
              <InfoItem key={idx} label={label} value={value} />
            ))}
          </div>

          {/* Shipping Info */}
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" /> Shipping Info
            </h2>
            {[
              ["Courier", order.courier || "N/A"],
              ["Method", order.shippingMethod || "N/A"],
              ["Tracking Number", order.trackingNumber || "N/A"],
              ["Estimated Delivery", formatDate(order.estimatedDeliveryDate)],
              ["Shipped At", formatDate(order.shippedAt)],
              ["Delivered At", formatDate(order.deliveredAt)],
            ].map(([label, value], idx) => (
              <InfoItem key={idx} label={label} value={value} />
            ))}
          </div>

          {/* Refund Info */}
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Undo2 className="w-5 h-5 text-red-500" /> Refund Info
            </h2>
            {[
              ["Requested", order.isRefundRequested ? "Yes" : "No"],
              ["Status", order.refundStatus || "N/A"],
              ["Return Reason", order.returnReason || "N/A"],
            ].map(([label, value], idx) => (
              <InfoItem key={idx} label={label} value={value} />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-yellow-600" />
            Notes
          </h2>
          {[
            ["Customer Note", order.note || "N/A"],
            ["Admin Note", order.adminNote || "N/A"],
          ].map(([label, value], idx) => (
            <InfoItem key={idx} label={label} value={value} />
          ))}
        </div>

        {/* Products */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" /> Products
          </h2>
          <div className="space-y-4">
            {order.products.map((product: Product, index: number) => (
              <div
                key={index}
                className="border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 bg-muted/10"
              >
                <div className="w-full sm:w-24 flex-shrink-0">
                  <Image
                    src={product.images}
                    alt={product.title}
                    width={96}
                    height={96}
                    className="rounded-md object-cover w-full h-24"
                  />
                </div>

                <div className="flex-1 text-sm space-y-1">
                  <p className="font-semibold text-base">{product.title}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4">
                    <p>
                      <span className="font-medium">SKU:</span> {product.sku}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {product.category}
                    </p>
                    <p>
                      <span className="font-medium">Brand:</span>{" "}
                      {product.brand || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span>{" "}
                      {product.price}$
                    </p>
                    <p>
                      <span className="font-medium">Selling Price:</span>{" "}
                      {product.sellingPrice || product.price}$
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span>{" "}
                      {product.quantity}
                    </p>
                  </div>

                  {Array.isArray(product.variations) &&
                    product.variations.length > 0 && (
                      <div className="mt-2">
                        <ul className="list-disc pl-4 text-muted-foreground">
                          {product.variations?.map((v, idx) => (
                            <li key={idx}>
                              {v.name}: {v.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-right text-sm text-muted-foreground pt-6 border-t">
          Last updated: {formatDate(order.updatedAt)}
        </div>
      </div>
      <InvoiceDownloader order={order} setting={setting} />
    </section>
  );
};

export default OrderDetails;

// --- Helper component ---
const Badge = ({
  status,
  color = "default",
}: {
  status: string;
  color?: "green" | "red" | "blue" | "pink" | "default";
}) => {
  const base = "inline-block px-2 py-0.5 rounded text-xs font-medium";
  const colorMap: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    pink: "bg-pink-100 text-pink-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`${base} ${colorMap[color || "default"]}`}>{status}</span>
  );
};
