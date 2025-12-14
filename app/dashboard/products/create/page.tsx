import { getAllCategories } from "@/lib/actions/category.actions";
import ProductForm from "../../components/ProductForm";
import { getAllBrands } from "@/lib/actions/brand.actions";

const CreatePage = async () => {
  const categories = await getAllCategories();
  const brands = await getAllBrands();

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Add a New Product</h2>
      <ProductForm type="Create" categories={categories} brands={brands} />
    </section>
  );
};

export default CreatePage;
