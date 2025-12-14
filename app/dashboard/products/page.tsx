import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/actions/product.actions";
import ProductTable from "../components/ProductTable";
import { auth } from "@clerk/nextjs/server";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";
import { redirect } from "next/navigation";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);

  if (!adminStatus) {
    redirect("/dashboard");
  }

  const products = (await getAllProducts()) || [];

  const safeProducts = products.map((p) => ({
    _id: p._id.toString() as string,
    title: p.title as string,
    price: String(p.price), // convert number|string → string
    stock: String(p.stock), // convert number|string → string
    category: p.category as string,
    brand: p.brand,
    sku: p.sku,
  }));

  return (
    <>
      <section className=" py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Products
          </h3>
          <a href="/dashboard/products/create" className="w-full md:w-max">
            <Button size="lg" className="rounded-full w-full">
              Add Product
            </Button>
          </a>
        </div>
      </section>

      <div className="wrapper my-8">
        <ProductTable products={safeProducts} />
      </div>
    </>
  );
};

export default Page;
