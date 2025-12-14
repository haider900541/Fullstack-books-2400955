"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/lib/actions/product.actions";
import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IProduct } from "@/lib/database/models/product.model";

interface SearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerHeight: number; // <-- Pass header height from RootLayout
}

export default function SearchDrawer({
  open,
  onOpenChange,
  headerHeight,
}: SearchDrawerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      const data = await searchProducts(query);
      setResults(data);
      setLoading(false);
    };

    const delay = setTimeout(fetchResults, 400);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="p-4 bg-white shadow-lg overflow-y-auto"
        style={{
          height: `calc(100vh - ${headerHeight}px)`,
          top: `${headerHeight}px`,
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-primary-600">Search Products</SheetTitle>
        </SheetHeader>

        <div className="relative mt-3 mb-4">
          <Input
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2 px-4 border-primary-600 focus:ring-2 focus:ring-primary-500 rounded-full"
          />
          <FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-600" />
        </div>

        {loading && <p className="text-gray-500 text-sm">Searching...</p>}

        {!loading && results.length === 0 && query && (
          <p className="text-gray-500 text-sm">
            No results found for “{query}”.
          </p>
        )}

        <div className="space-y-3">
          {results.map((item, idx) => (
            <a
              key={idx}
              href={`/products/${item._id}`}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-2 rounded-lg border hover:bg-primary-50 transition"
            >
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={
                    item.images?.[0]?.imageUrl ||
                    "/assets/images/placeholder.png"
                  }
                  alt={item.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {item.title}
                </span>
                <span className="text-primary-600 text-sm font-medium">
                  ${item.price}
                </span>
              </div>
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
