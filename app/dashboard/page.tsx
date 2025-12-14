"use client";

import { useEffect, useState } from "react";
import { Clipboard, Calendar, Users, HelpCircle } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllOrders, getOrdersByEmail } from "@/lib/actions/order.actions";
import { getAllBanners } from "@/lib/actions/banner.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getAllBrands } from "@/lib/actions/brand.actions";
import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DashboardStats from "./components/DashboardStats";
import { getUserByClerkId, getUserEmailById } from "@/lib/actions/user.actions";
import { isAdmin } from "@/lib/actions/admin.actions";
import { useUser } from "@clerk/nextjs";
import { IProduct } from "@/lib/database/models/product.model";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const { user } = useUser();
  const userId = user?.id || "";
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await getUserByClerkId(userId);
        const email = await getUserEmailById(userID);
        const adminStatus = await isAdmin(email);
        setAdminStatus(adminStatus);

        const ordersData = adminStatus
          ? await getAllOrders()
          : await getOrdersByEmail(email);

        const [productsData, bannersData, categoriesData, brandsData] =
          await Promise.all([
            getAllProducts(),
            getAllBanners(),
            getAllCategories(),
            getAllBrands(),
          ]);

        setProducts(productsData || []);
        setOrders(ordersData);
        setBanners(bannersData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminStatus && (
            <DashboardCard
              icon={<Clipboard className="text-3xl text-blue-500" />}
              title="Total Products"
              value={products.length}
            />
          )}

          <DashboardCard
            icon={<Calendar className="text-3xl text-purple-500" />}
            title="Total Orders"
            value={`${orders.length}`}
          />
          {adminStatus && (
            <DashboardCard
              icon={<Users className="text-3xl text-indigo-500" />}
              title="Total Banners"
              value={`${banners.length}`}
            />
          )}
          {adminStatus && (
            <DashboardCard
              icon={<HelpCircle className="text-3xl text-teal-500" />}
              title="Total Categories"
              value={`${categories.length}`}
            />
          )}
          {adminStatus && (
            <DashboardCard
              icon={<HelpCircle className="text-3xl text-teal-500" />}
              title="Total Brands"
              value={`${brands.length}`}
            />
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
        <DashboardStats orders={orders} />
      </div>
    </div>
  );
};

// Reusable Card Component
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const DashboardCard = ({ icon, title, value }: DashboardCardProps) => (
  <Card className="rounded-2xl shadow-md bg-white px-5 py-6 flex flex-col justify-between transition hover:shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {icon && <div className="text-xl text-violet-600">{icon}</div>}
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="w-12 h-12">
        <CircularProgressbar
          value={Number(value)}
          text={value.toString()}
          styles={buildStyles({
            textColor: "#6C63FF",
            pathColor: "#6C63FF",
            trailColor: "#eee",
            textSize: "28px",
          })}
        />
      </div>
    </div>
  </Card>
);

export default Dashboard;
