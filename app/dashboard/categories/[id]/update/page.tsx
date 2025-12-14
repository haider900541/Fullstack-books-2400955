import CategoryForm from "@/app/dashboard/components/CategoryForm";
import { getCategoryById } from "@/lib/actions/category.actions";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};
const UpdatePage = async ({ params }: PageProps) => {
  const { id } = await params;

  const category = await getCategoryById(id);
  if (!category) redirect("/dashboard/categories");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Update Category</h2>
      <CategoryForm
        type="Update"
        category={category}
        categoryId={id}
      />
    </div>
  );
};

export default UpdatePage;
