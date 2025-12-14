"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import NavItems from "./NavItems";
import { LogIn, Package, Shield, ShoppingCart } from "lucide-react";
import MobileNav from "./MobileNav";
import { getUserByClerkId, getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";
import {
  getCartsByEmail,
  updateCart,
  deleteCart,
} from "@/lib/actions/cart.actions";

import React, { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CartCard from "./CartCard";
import toast from "react-hot-toast";
import { getSetting } from "@/lib/actions/setting.actions";
import { ISetting } from "@/lib/database/models/setting.model";
import { FaMagnifyingGlass } from "react-icons/fa6";

type CartItem = {
  _id: string;
  title: string;
  images: string;
  price: number;
  sellingPrice: number;
  quantity: number;
  variations?: {
    name: string;
    value: string;
    additionalPrice?: number;
  }[];
};

interface HeaderProps {
  openSearch: () => void;
}

export default function Header({ openSearch }: HeaderProps) {
  const { user } = useUser();
  const [adminStatus, setAdminStatus] = useState(false);
  const [Email, setEmail] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [settings, setSettings] = useState<ISetting | null>(null);

  useEffect(() => {
    (async () => {
      const setting = await getSetting();
      setSettings(setting);
    })();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) {
      setCartItems([]);
      setAdminStatus(false);
      setInitialLoad(false);
      return;
    }

    try {
      const userID = await getUserByClerkId(user.id);
      const email = await getUserEmailById(userID);
      setEmail(email);

      const [isAdminStatus, carts] = await Promise.all([
        isAdmin(email),
        getCartsByEmail(email),
      ]);

      setAdminStatus(isAdminStatus);
      setCartItems(carts || []);
    } catch {
      setCartItems([]);
      setAdminStatus(false);
    } finally {
      setInitialLoad(false);
    }
  }, [user?.id]);

  const isCartEmpty = cartItems.length <= 0;

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(() => {
      fetchUserData();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchUserData]);

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCart(id, { quantity });
      await fetchUserData();
      toast.success("Quantity updated.");
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCart(id);
      await fetchUserData();
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <header className="text-white">
      {/* Main header */}
      <div className="bg-[#3e0078] flex items-center justify-between gap-2 px-4 py-2">
        <a href={"/"} className="flex items-center gap-2">
          <Image
            src={settings?.logo || "/assets/images/logo.png"}
            width={100}
            height={100}
            className="w-10 h-10 md:w-8 md:h-8 lg:w-12 lg:h-12"
            priority
            quality={100}
            alt={settings?.name || "Logo"}
          />
          <h1 className="md:text-3xl lg:text-4xl font-serif font-bold hidden md:flex gap-2">
            <span className="text-white">{settings?.name?.split(" ")[0]}</span>
            <span className="text-primary-600">
              {" "}
              {settings?.name?.split(" ").slice(1).join(" ")}
            </span>
          </h1>
        </a>

        {/* Live Search Input */}
        <div className="flex-1 max-w-md w-full mx-4">
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white bg-white transition w-full"
          >
            <FaMagnifyingGlass />
            Search...
          </button>
        </div>

        <div className="flex items-center gap-3">
          <SignedIn>
            {adminStatus && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <a href="/dashboard" className="flex items-center gap-1">
                  <Shield /> <span className="hidden md:flex">Dashboard</span>
                </a>
              </Button>
            )}
            <UserButton afterSwitchSessionUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              <a href={"/sign-in"} className="flex items-center gap-1">
                <LogIn /> <span>Login</span>
              </a>
            </Button>
          </SignedOut>
        </div>
      </div>

      {/* Navigation and Cart */}
      <div className="bg-[#1d0237] flex items-center justify-between px-4 py-2">
        <nav className="lg:flex hidden w-full max-w-xs">
          <NavItems />
        </nav>
        <MobileNav />

        {Email ? (
          <div className="flex items-center gap-4">
            <a href={"/orders"}>
              <Button
                size={"sm"}
                variant={"ghost"}
                className="text-white hover:text-primary-500 flex items-center gap-1 rounded-full"
              >
                {" "}
                <Package size={18} /> <span className="">My Orders</span>
              </Button>
            </a>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="relative focus:outline-none text-white hover:text-white"
                  aria-label="Open cart"
                >
                  <ShoppingCart size={24} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="max-w-md p-4 bg-white text-primary"
              >
                <SheetHeader>
                  <SheetTitle className="mb-4 text-primary">
                    Your Cart
                  </SheetTitle>
                </SheetHeader>

                <div className="space-y-4 overflow-y-auto max-h-[400px]">
                  {initialLoad ? (
                    <p>Loading cart...</p>
                  ) : cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                  ) : (
                    cartItems
                      .slice(0, 3)
                      .map((item) => (
                        <CartCard
                          key={item._id}
                          item={item}
                          onUpdateQuantity={handleQuantityChange}
                          onDelete={handleDelete}
                        />
                      ))
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href="/cart"
                    onClick={(e) => isCartEmpty && e.preventDefault()}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-red-200"
                      onClick={() => setSheetOpen(false)}
                      disabled={isCartEmpty}
                    >
                      View All Items
                    </Button>
                  </a>

                  <a
                    href="/checkout"
                    onClick={(e) => isCartEmpty && e.preventDefault()}
                  >
                    <Button
                      className="w-full bg-primary hover:bg-primary text-white"
                      onClick={() => setSheetOpen(false)}
                      disabled={isCartEmpty}
                    >
                      Proceed to Checkout
                    </Button>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <a href={"/sign-in"} className="text-white hover:text-primary-50">
            <ShoppingCart />
          </a>
        )}
      </div>
    </header>
  );
}
