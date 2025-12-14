import { Suspense } from "react";
import ProductFiltersClient from "@/components/shared/ProductFiltersClient";
import Loader from "@/components/shared/Loader";
import { getAllCategories } from "@/lib/actions/category.actions";

export default async function ProductPage() {
  const categories = await getAllCategories();

  return (
    <Suspense fallback={<Loader />}>
      <ProductFiltersClient categories={categories} />
    </Suspense>
  );
}
