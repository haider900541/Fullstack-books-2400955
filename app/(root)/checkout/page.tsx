"use client";

import { useEffect, useState, useMemo } from "react";
import { deleteCartsByEmail, getCartsByEmail } from "@/lib/actions/cart.actions";
import { createOrder } from "@/lib/actions/order.actions"; // Make sure you have this
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/shared/Loader";
import { getSetting } from "@/lib/actions/setting.actions";
import { ISetting } from "@/lib/database/models/setting.model";
import { OrderParams } from "@/types";

type CartItem = {
  _id: string;
  productId: string;
  title: string;
  images: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  sku: string;
  variations?: {
    name: string;
    value: string;
  }[];
};

type Customer = {
  name: string;
  email: string;
  number: string;
  address: string;
  areaOfDelivery: string;
  district: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState("");
  const [shipping, setShipping] = useState<number>(120);
  const [settings, setSettings] = useState<ISetting | null>(null);

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    number: "",
    address: "",
    areaOfDelivery: "",
    district: "",
  });

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  const total = useMemo(
    () => (subtotal ?? 0) + (shipping ?? 0),
    [subtotal, shipping]
  );

  // Fetch settings
  useEffect(() => {
    (async () => {
      const setting = await getSetting();
      setSettings(setting);
    })();
  }, []);

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user?.id) return;
      try {
        setIsCartLoading(true);
        const items = await getCartsByEmail(
          user.emailAddresses?.[0]?.emailAddress || ""
        );
        setCartItems(items || []);
      } catch {
        toast.error("Failed to load cart items.");
      } finally {
        setIsCartLoading(false);
        setIsLoading(false);
      }
    };
    fetchCartData();
  }, [user?.id, user?.emailAddresses]);

  if (!isLoading && !isCartLoading && cartItems.length === 0) {
    router.push("/products");
  }

  if (isLoading) {
    return <Loader />;
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));

    if (name === "district") {
      setShipping(
        value.toLowerCase() === "dhaka"
          ? Number(settings?.deliveryCharge.insideDhaka) || 0
          : Number(settings?.deliveryCharge.outSideDhaka) || 0
      );
    }
  };

  const placeOrder = async () => {
    if (
      !customer.name ||
      !customer.email ||
      !customer.number ||
      !customer.address
    ) {
      toast.error("Please fill in all customer details.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);

      const orderPayload: OrderParams = {
        customer: {
          name: customer.name,
          email: customer.email,
          number: customer.number,
          address: customer.address,
          areaOfDelivery: customer.areaOfDelivery,
          district: customer.district,
        },
        products: cartItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          variations: item.variations || [],
          images: item.images,
          category: item.category,
          sku: item.sku,
        })),
        email: customer.email,
        subtotal: subtotal,
        shipping: shipping,
        totalAmount: total,
        paymentMethod: "cod",
        paymentStatus: "pending",
        transactionId: `COD_${Date.now()}`,
        note: note || "",
      };

      const newOrder = await createOrder(orderPayload);

      await deleteCartsByEmail(customer.email);
      setCartItems([]);

      toast.success("Order placed successfully!");
      router.push(`/orders/${newOrder.orderId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Shipping and Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Customer Form */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          {[
            "name",
            "email",
            "number",
            "address",
            "areaOfDelivery",
            "district",
          ].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(customer as any)[field]}
              onChange={handleCustomerChange}
              className="w-full border p-2 rounded"
            />
          ))}

          <textarea
            placeholder="Order Notes (optional)"
            className="w-full border p-2 rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-4 border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Your Order</h2>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-start justify-between">
                <div className="flex gap-2">
                  <Image
                    src={item.images}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded border h-20 w-14 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      x {item.quantity}
                    </p>
                    {Array.isArray(item.variations) &&
                      item.variations.length > 0 && (
                        <div className="text-xs text-gray-500 space-y-1 mt-1">
                          {item.variations.map((v, i) => (
                            <p key={i}>
                              {v.name}: <strong>{v.value}</strong>
                            </p>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={placeOrder}
            disabled={isPlacingOrder || cartItems.length === 0}
            className="mb-4 w-full"
          >
            {isPlacingOrder
              ? "Placing Order..."
              : `Place Order (COD: $${total.toFixed(2)})`}
          </Button>
        </div>
      </div>
    </section>
  );
}
