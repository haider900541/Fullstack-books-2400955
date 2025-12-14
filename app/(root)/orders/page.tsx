import { Button } from "@/components/ui/button";
import { getOrdersByEmail } from "@/lib/actions/order.actions";
import { auth } from "@clerk/nextjs/server";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";
import ClientOrderTable from "@/app/dashboard/components/ClientOrderTable";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);

  const orders = await getOrdersByEmail(email);

  return (
    <>
      <section className="max-w-7xl mx-auto py-2 md:py-5 space-y-8">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            My Orders
          </h3>
          <a href="/checkout" className="w-full md:w-max">
            <Button size="lg" className="rounded-full w-full">
              Place New Order
            </Button>
          </a>
        </div>
        {orders && orders.length > 0 ? (
          <ClientOrderTable orders={orders} isAdmin={adminStatus} />
        ) : (
          <div className="text-center text-gray-500">No orders found.</div>
        )}
      </section>
    </>
  );
};

export default Page;
