import BrandForm from "@/app/dashboard/components/BrandForm";
import { getBrandById } from "@/lib/actions/brand.actions";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};
const UpdatePage = async ({ params }: PageProps) => {
  const { id } = await params;

  const brand = await getBrandById(id);
  if (!brand) redirect("/dashboard/brands");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Update Brand</h2>
      <BrandForm
        type="Update"
        brand={brand}
        brandId={id}
      />
    </div>
  );
};

export default UpdatePage;
