import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getAdminRole, isAdmin } from "@/lib/actions/admin.actions";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { cookies } from "next/headers";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const { sessionClaims } = await auth();

  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);
  const role = await getAdminRole(email);

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar role={role || ""} />
      <Toaster />
      <main className="flex-1 h-screen mx-auto overflow-y-auto">
        <div className="flex justify-between items-center p-4 w-full border-b text-white bg-[#3e0078]">
          <SidebarTrigger />
          <SignedIn>
            <UserButton afterSwitchSessionUrl="/" />
          </SignedIn>
        </div>
        <Breadcrumbs />
        <div className="p-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
