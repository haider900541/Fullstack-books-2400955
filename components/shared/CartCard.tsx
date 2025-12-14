"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type Variation = {
  name: string;
  value: string;
  additionalPrice?: number;
};

type ProductItem = {
  _id: string;
  title: string;
  images: string;
  price: number;
  quantity: number;
  variations?: Variation[];
};

type ProductCardProps = {
  item: ProductItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
};

const ProductCard = ({
  item,
  onUpdateQuantity,
  onDelete,
}: ProductCardProps) => {
  return (
    <div className="w-full h-40 border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-900 flex gap-4">
      {/* Product Image */}
      <div className="w-24 h-32 flex-shrink-0">
        <Image
          src={item.images}
          alt={item.title}
          width={100}
          height={100}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-between flex-1">
        {/* Title, Price, Variations */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold line-clamp-1">{item.title}</h2>

          <div className="flex gap-2 items-baseline">
            <span className="text-green-600 font-semibold text-sm">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {item.variations?.map((v, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              {v.name}: {v.value}
            </p>
          ))}
        </div>

        {/* Bottom Row: Quantity + Remove */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))
              }
            >
              –
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <div className="place-content-center">
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(item._id)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
