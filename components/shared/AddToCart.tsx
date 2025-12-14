"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { addToCart, getCartsByEmail } from "@/lib/actions/cart.actions";
import toast from "react-hot-toast";

type Variation = {
  name: string;
  value: string;
  additionalPrice?: number | string;
};

type Product = {
  _id: string;
  title: string;
  images: { imageUrl: string; _id: string }[];
  price: string | number;
  category: string;
  brand?: string;
  sku: string;
  variations?: Variation[];
};

type CartItem = {
  productId: string;
  quantity: number;
  variations?: Variation[];
};

type AddToCartProps = {
  product: Product;
  email: string;
};

const AddToCart = ({ product, email }: AddToCartProps) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const basePrice = parseFloat(product.price.toString());
  const additionalPrice = selectedVariation?.additionalPrice
    ? parseFloat(selectedVariation.additionalPrice.toString())
    : 0;
  const finalPrice = basePrice + additionalPrice;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartsByEmail(email);
        setCartItems(items || []);
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    };
    fetchCart();
  }, [email]);

  const isAlreadyInCart = () => {
    return cartItems.some((item) => {
      if (item.productId !== product._id) return false;
      if (item.quantity !== quantity) return false;

      if (selectedVariation && item.variations) {
        return item.variations.some(
          (v) =>
            v.name === selectedVariation.name &&
            v.value === selectedVariation.value
        );
      }

      return (
        !selectedVariation && (!item.variations || item.variations.length === 0)
      );
    });
  };

  const handleAddToCart = async () => {
    if (
      product.variations &&
      product.variations.length > 0 &&
      !selectedVariation
    ) {
      toast.error("Please select a variation before adding to cart.");
      return;
    }

    if (isAlreadyInCart()) {
      toast.error(
        "This product with the same variation and quantity is already in your cart."
      );
      return;
    }

    setLoading(true);

    try {
      await addToCart({
        productId: product._id,
        title: product.title,
        images: product.images?.[0]?.imageUrl || "",
        price: finalPrice,
        quantity,
        category: product.category,
        brand: product.brand,
        sku: product.sku,
        variations: selectedVariation ? [selectedVariation] : [],
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success("Added to cart successfully!");
      setCartItems((prev) => [
        ...prev,
        {
          productId: product._id,
          quantity,
          variations: selectedVariation ? [selectedVariation] : [],
        },
      ]);
      setQuantity(1);
      setSelectedVariation(null);
    } catch (err) {
      toast.error("Something went wrong while adding to cart.");
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Variation Selector */}
      {product.variations && product.variations.length > 0 && (
        <div className="space-y-1">
          <Label>Select Variant</Label>
          <Select
            onValueChange={(val) => {
              const variant = product.variations?.find((v) => v.value === val);
              setSelectedVariation(variant || null);
            }}
            value={selectedVariation?.value || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Variation" />
            </SelectTrigger>
            <SelectContent>
              {product.variations.map((variation) => (
                <SelectItem key={variation.value} value={variation.value}>
                  {variation.value}
                  {variation.additionalPrice &&
                  parseFloat(variation.additionalPrice.toString()) > 0
                    ? ` (+$${variation.additionalPrice})`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Quantity Input */}
      <div className="space-y-1">
        <Label>Quantity</Label>
        <Input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
        />
      </div>

      {/* Price Display */}
      <div className="font-semibold text-lg">
        Total: ${(finalPrice * quantity).toFixed(2)}
      </div>

      {email ? (
        <Button
          onClick={handleAddToCart}
          disabled={
            loading ||
            (!!product.variations &&
              product.variations.length > 0 &&
              !selectedVariation)
          }
          className="w-full"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      ) : (
        <a href={"/sign-in"}>
          <Button disabled={!email} className="w-full">
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </a>
      )}
    </div>
  );
};

export default AddToCart;
