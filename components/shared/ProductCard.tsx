"use client";

import { Types } from "mongoose";
import Image from "next/image";

type ProductCardProps = {
  _id: Types.ObjectId;
  title: string;
  price: string;
  oldPrice?: string;
  category: string;
  images: {
    imageUrl: string;
  }[];
};

const ProductCard = ({
  _id,
  title,
  price,
  oldPrice,
  category,
  images,
}: ProductCardProps) => {
  const firstImage = images?.[0]?.imageUrl || "/assets/images/placeholder.png";
  const secondImage = images?.[1]?.imageUrl || firstImage;

  return (
    <a
      href={`/products/${_id}`}
      className="group p-2 lg:p-4 border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-transform transform hover:scale-[1.02] duration-300 space-y-1 lg:space-y-2"
    >
      <div className="w-full h-24 md:h-36 lg:h-64 relative overflow-hidden rounded-md bg-gray-100">
        {/* First Image */}
        <Image
          src={firstImage}
          alt={title}
          fill
          className="object-contain transition-opacity duration-300 ease-in-out group-hover:opacity-0"
        />
        {/* Second Image on hover */}
        <Image
          src={secondImage}
          alt={title + " alt"}
          fill
          className="object-contain transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
        />
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-sm md:text-md lg:text-lg line-clamp-2">
          {title}
        </h4>

        <div className="flex items-center gap-2">
          <p className="text-primary font-bold">${price}</p>
          {oldPrice && (
            <p className="text-gray-400 line-through text-sm">${oldPrice}</p>
          )}
        </div>

        <p className="text-xs text-gray-500">{category}</p>
      </div>
    </a>
  );
};

export default ProductCard;
