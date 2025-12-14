import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/actions/category.actions";
import CategoryTable from "../components/CategoryTable";
import { auth } from "@clerk/nextjs/server";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { getAdminRole, isAdmin } from "@/lib/actions/admin.actions";
import { redirect } from "next/navigation";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);
  const role = await getAdminRole(email);

  if (!adminStatus || role !== "Admin") {
    redirect("/dashboard");
  }

  const categories = await getAllCategories();

  return (
    <>
      <section className=" py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Categories
          </h3>
          <a href="/dashboard/categories/create" className="w-full md:w-max">
            <Button size="lg" className="rounded-full w-full">
              Add Category
            </Button>
          </a>
        </div>
      </section>

      <div className="wrapper my-8">
        <CategoryTable categories={categories} />
      </div>
    </>
  );
};

export default Page;
