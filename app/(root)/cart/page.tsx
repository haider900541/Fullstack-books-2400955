"use client";

import { useEffect, useState, useCallback } from "react";
import {
  updateCart,
  deleteCart,
  getCartsByEmail,
} from "@/lib/actions/cart.actions";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { getUserByClerkId, getUserEmailById } from "@/lib/actions/user.actions";
import CartCard from "@/components/shared/CartCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type CartItem = {
  _id: string;
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
    additionalPrice?: number;
  }[];
};

export default function CartPage() {
  const router = useRouter();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = useCallback(async () => {
    try {
      if (!user?.id) return;

      const userID = await getUserByClerkId(user.id);
      const email = await getUserEmailById(userID);

      if (!email) {
        toast.error("Email not found.");
        return;
      }

      const items = await getCartsByEmail(email);
      setCartItems(items || []);
    } catch (err) {
      toast.error("Failed to load cart.");
      console.error(err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCart();

    const interval = setInterval(() => {
      fetchCart();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchCart]);

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCart(id, { quantity });
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
      toast.success("Quantity updated.");
      router.refresh();
    } catch {
      toast.error("Failed to update quantity.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCart(id);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Item removed from cart.");
      router.refresh();
    } catch {
      toast.error("Failed to delete item.");
    }
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {cartItems.map((item) => (
              <CartCard
                key={item._id}
                item={item}
                onUpdateQuantity={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="text-right font-bold text-lg pt-4 border-t flex items-center gap-4 justify-end">
            Total: ${getTotal().toFixed(2)}{" "}
            <a href="/checkout">
              <Button className="px-6 py-2 text-white bg-primary hover:bg-primary/90">
                Proceed to Checkout
              </Button>
            </a>
          </div>
        </>
      )}
    </section>
  );
}
