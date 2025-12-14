import { IOrder } from "@/lib/database/models/order.model";
import { ISetting } from "@/lib/database/models/setting.model";
import Image from "next/image";

type InvoiceTemplateProps = {
  order: IOrder;
  setting: ISetting;
};

type OrderProduct = {
  images: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
};

export default function InvoiceTemplate({
  order,
  setting,
}: InvoiceTemplateProps) {
  const formatDate = (date: Date | string | undefined) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  const total = Number(order.totalAmount) || 0;
  const advance = Number(order.advancePaid) || 0;
  const balance = total - advance;

  return (
    <div className="w-[210mm] min-h-[297mm] p-10 bg-white text-gray-800 font-sans">
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
            {order.orderId || order._id.toString()}
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

      {/* Customer Details */}
      <div className="mt-6 border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
        <p className="font-medium text-gray-700">{order.customer.name}</p>
        <p className="text-gray-600">{order.customer.number}</p>
        <p className="text-gray-600">
          {order.customer.address}, {order.customer.areaOfDelivery},{" "}
          {order.customer.district}
        </p>
      </div>

      {/* Products Table */}
      <table className="w-full border-collapse mt-8 text-sm">
        <thead>
          <tr className="bg-blue-50 text-gray-700">
            <th className="border p-3 text-left">Thumbnail</th>
            <th className="border p-3 text-left">Product</th>
            <th className="border p-3 text-left">SKU</th>
            <th className="border p-3 text-center">Qty</th>
            <th className="border p-3 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p: OrderProduct, i: number) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border p-2 w-20 h-20 relative">
                <Image
                  src={p.images}
                  alt={p.title}
                  width={80}
                  height={80}
                  unoptimized
                  className="object-contain rounded-md border bg-white p-1"
                />
              </td>
              <td className="border p-2">{p.title}</td>
              <td className="border p-2">{p.sku}</td>
              <td className="border p-2 text-center">{p.quantity}</td>
              <td className="border p-2 text-right">${p.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-8 flex justify-end">
        <div className="w-1/3 border rounded-lg p-4 bg-gray-50 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Advance Paid:</span>
            <span>${advance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-red-600 text-lg border-t pt-2">
            <span>Balance Due:</span>
            <span>${balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8">
        <p className="font-semibold mb-1">Customer Notes:</p>
        <p className="text-sm text-gray-700">{order.note || "N/A"}</p>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-4 text-center text-xs text-gray-500 space-y-1">
        <p>Thank you for your business!</p>
        <p>
          {setting?.name} • {setting?.email} • {setting?.phoneNumber}
        </p>
      </div>
    </div>
  );
}
