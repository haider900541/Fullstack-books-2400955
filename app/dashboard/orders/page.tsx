import { Button } from "@/components/ui/button";
import { getAllOrders, getOrdersByEmail } from "@/lib/actions/order.actions";
import OrderTable from "../components/OrderTable";
import { auth } from "@clerk/nextjs/server";
import { getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";

const Page = async () => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const email = await getUserEmailById(userId);
  const adminStatus = await isAdmin(email);

  const orders = adminStatus
    ? await getAllOrders()
    : await getOrdersByEmail(email);

  return (
    <>
      <section className=" py-2 md:py-5">
        <div className="wrapper flex flex-wrap justify-between items-center">
          <h3 className="text-3xl font-bold text-center sm:text-left">
            All Orders
          </h3>
          <a href="/checkout" className="w-full md:w-max">
            <Button size="lg" className="rounded-full w-full">
              Place New Order
            </Button>
          </a>
        </div>
      </section>

      <div className="wrapper my-8">
        <OrderTable orders={orders} isAdmin={adminStatus} />
      </div>
    </>
  );
};

export default Page;
