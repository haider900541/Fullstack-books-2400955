"use client";

import { useState } from "react";
import Image from "next/image";
import { ISetting } from "@/lib/database/models/setting.model";

interface CategoryItem {
  _id: string;
  title: string;
  image?: string;
}

export default function CategoriesList({
  categories,
  settings,
}: {
  categories: CategoryItem[];
  settings?: ISetting;
}) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const allCategoriesOption: CategoryItem = {
    _id: "all",
    title: "All Categories",
    image: settings?.logo || "/assets/images/logo.png",
  };

  const sortedCategories = [
    allCategoriesOption,
    ...categories.sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title, "en", { sensitivity: "base" })
        : b.title.localeCompare(a.title, "en", { sensitivity: "base" })
    ),
  ];

  return (
    <section id="categories" className="my-8 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Sort: {sortOrder === "asc" ? "A–Z" : "Z–A"}
        </button>
      </div>

      {sortedCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 m-4">
          {sortedCategories.map((category) => (
            <a
              key={category._id}
              href={
                category._id === "all"
                  ? `/products`
                  : `/products?category=${encodeURIComponent(category.title)}`
              }
              className="border p-4 rounded-lg text-center hover:shadow-md transition"
            >
              <Image
                src={category.image || "/assets/images/placeholder.png"}
                alt={category.title}
                width={200}
                height={150}
                className="w-full h-32 object-contain mb-2 rounded"
              />
              <h3 className="text-lg font-medium">{category.title}</h3>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No categories found.</div>
      )}
    </section>
  );
}
