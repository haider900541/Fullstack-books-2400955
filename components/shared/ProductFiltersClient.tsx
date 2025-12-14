"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Filter, X } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import { IProduct } from "@/lib/database/models/product.model";
import { ICategory } from "@/lib/database/models/category.model";
import { getFilteredProducts } from "@/lib/actions/product.actions";

const subCategoryOptions = [
  "Fresh Reads",
  "Spotlight Picks",
  "Top Sellers",
  "Hot Reads",
  "Collector’s Editions",
  "Special Releases",
  "Critically Acclaimed",
  "Bargain Books",
  "Quick Picks",
  "Clearance Corner",
  "Back by Popular Demand",
  "Steal of the Week",
  "Editor's Choice",
  "Weekly Spotlight",
  "Seasonal Favorites",
  "Staff Recommendations",
  "Perfect Gift Books",
  "Readers’ Choice",
];

interface ProductFiltersClientProps {
  categories: ICategory[];
}

export default function ProductFiltersClient({
  categories,
}: ProductFiltersClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<"" | "lowToHigh" | "highToLow">(
    ""
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showSubCategories, setShowSubCategories] = useState(true);

  const productsPerPage = 32;

  // Sync URL params to state
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedCategories(
      (searchParams.get("category") || "").split(",").filter(Boolean)
    );
    setSelectedSubCategories(
      (searchParams.get("subCategory") || "").split(",").filter(Boolean)
    );
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
    setSortOrder((searchParams.get("sort") as "lowToHigh" | "highToLow") || "");
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategories.length)
      params.set("category", selectedCategories.join(","));
    if (selectedSubCategories.length)
      params.set("subCategory", selectedSubCategories.join(","));
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (sortOrder) params.set("sort", sortOrder);
    params.set("page", String(currentPage));

    router.replace(`/products?${params.toString()}`);
  }, [
    search,
    selectedCategories,
    selectedSubCategories,
    minPrice,
    maxPrice,
    sortOrder,
    currentPage,
    router,
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getFilteredProducts({
          search,
          category: selectedCategories.join(","),
          subCategory: selectedSubCategories.join(","),
          minPrice: minPrice ? Number(minPrice) : NaN,
          maxPrice: maxPrice ? Number(maxPrice) : NaN,
          sort: sortOrder || null,
          page: currentPage,
          limit: productsPerPage,
        });

        setProducts(data.products || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    search,
    selectedCategories,
    selectedSubCategories,
    minPrice,
    maxPrice,
    sortOrder,
    currentPage,
  ]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (sub: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / productsPerPage);

  const Pagination = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      if (start > 2) pageNumbers.push(ellipsis);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (end < totalPages - 1) pageNumbers.push(ellipsis);
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        {pageNumbers.map((num, i) =>
          num === ellipsis ? (
            <span key={i} className="px-2 py-1 text-gray-500">
              {ellipsis}
            </span>
          ) : (
            <Button
              key={i}
              size="sm"
              variant={currentPage === num ? "default" : "outline"}
              onClick={() => setCurrentPage(Number(num))}
            >
              {num}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  const FilterSection = ({
    title,
    show,
    toggle,
    children,
  }: {
    title: string;
    show: boolean;
    toggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border-t pt-4 mt-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggle}
      >
        <h4 className="font-medium text-sm">{title}</h4>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${show ? "rotate-180" : ""}`}
        />
      </div>
      {show && <div className="mt-2">{children}</div>}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="search" className="block text-sm font-medium">
          Search
        </label>
        <Input
          id="search"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price Range</label>
        <div className="mt-2 flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Sort by Price</label>
        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "lowToHigh" | "highToLow" | "")
          }
          className="mt-2 w-full border rounded-md p-2 text-sm"
        >
          <option value="">Default</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      <FilterSection
        title="Category"
        show={showCategories}
        toggle={() => setShowCategories(!showCategories)}
      >
        <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {categories.map((cat, idx) => (
            <li key={idx} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.title)}
                onChange={() => handleCategoryChange(cat.title)}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label className="ml-2 text-sm capitalize">{cat.title}</label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection
        title="Sub Category"
        show={showSubCategories}
        toggle={() => setShowSubCategories(!showSubCategories)}
      >
        <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {subCategoryOptions.map((sub) => (
            <li key={sub} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSubCategories.includes(sub)}
                onChange={() => handleSubCategoryChange(sub)}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label className="ml-2 text-sm capitalize">{sub}</label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <Button
        className="w-full bg-red-500 text-white hover:bg-red-600"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <section className="wrapper py-6">
      {/* Mobile Filter */}
      <div className="lg:hidden m-4 flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="h-full w-full lg:w-80 flex flex-col justify-between bg-white"
          >
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto p-4">{FilterContent()}</div>
            <div className="p-4 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearFilters}
              >
                Clear
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
        <aside className="hidden lg:block border rounded-md p-4 bg-white h-fit sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          {FilterContent()}
        </aside>

        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Active Filters Summary */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                {cat}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => handleCategoryChange(cat)}
                />
              </span>
            ))}
            {search && (
              <span className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                “{search}”
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => setSearch("")}
                />
              </span>
            )}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
              {Array.from({ length: productsPerPage }).map((_, i) => (
                <div
                  key={i}
                  className="group p-2 lg:p-4 border rounded-md overflow-hidden bg-white shadow-sm animate-pulse"
                >
                  <div className="w-full h-24 md:h-36 lg:h-64 relative overflow-hidden rounded-md bg-gray-200" />
                  <div className="p-2 lg:p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
              {products.length === 0 ? (
                <p className="col-span-full text-center py-20 text-gray-500">
                  No products found.
                </p>
              ) : (
                products.map((p) => (
                  <ProductCard key={p._id.toString()} {...p} />
                ))
              )}
            </div>
          )}

          {totalCount > productsPerPage && <Pagination />}
        </div>
      </div>
    </section>
  );
}
