import { auth } from "@clerk/nextjs/server";
import {
  getAdminRole,
  getAllAdmins,
  isAdmin,
} from "@/lib/actions/admin.actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdminForm from "../components/AdminForm";
import AdminTable from "../components/AdminTable";
import { Button } from "@/components/ui/button";
import { getUserEmailById } from "@/lib/actions/user.actions";
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

  const admins = await getAllAdmins();

  return (
    <>
      <section className=" py-2 md:py-5">
        <Sheet>
          <div className="wrapper flex flex-wrap justify-between items-center">
            <h3 className="text-3xl font-bold text-center sm:text-left">All Admins</h3>
            <SheetTrigger>
              <Button size="lg" className="rounded-full">
                Create Admin
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent className="bg-white">
            <SheetHeader>
              <SheetTitle>Create New Admin</SheetTitle>
              <SheetDescription>
                Use this form to create a new admin account within the system.
                Fill out all required fields accurately to ensure proper setup
                and access permissions for the new admin.
              </SheetDescription>
            </SheetHeader>
            <div className="py-5">
              <AdminForm userId={userId} type="Create" />
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <div className="wrapper my-8">
        <AdminTable admins={admins} />
      </div>
    </>
  );
};

export default Page;
