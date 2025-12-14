"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Product = {
  price: number;
  sellingPrice: number;
  quantity: number;
};

type Order = {
  products: Product[];
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
};

type Stats = {
  totalRevenue: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
};

function calculateOrderStats(orders: Order[]): Stats {
  let totalRevenue = 0;
  let totalCost = 0;

  orders.forEach((order) => {
    order.products?.forEach((product) => {
      const qty = product.quantity || 1;
      totalRevenue += (product.sellingPrice || 0) * qty;
      totalCost += (product.price || 0) * qty;
    });
  });

  const profit = totalRevenue - totalCost;
  const profitMargin =
    totalRevenue > 0
      ? parseFloat(((profit / totalRevenue) * 100).toFixed(2))
      : 0;

  return {
    totalRevenue,
    totalCost,
    profit,
    profitMargin,
  };
}

const DashboardStats = ({ orders }: { orders: Order[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [range, setRange] = useState<"7d" | "1m" | "1y" | "custom">("7d");

  useEffect(() => {
    const startParam = searchParams.get("startDate");
    const endParam = searchParams.get("endDate");

    if (startParam && endParam) {
      setStartDate(new Date(startParam));
      setEndDate(new Date(endParam));
      setRange("custom");
    } else {
      const today = new Date();
      const last7Days = new Date();
      last7Days.setDate(today.getDate() - 6);
      setStartDate(last7Days);
      setEndDate(today);
      setRange("7d");
    }
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    if (!startDate || !endDate) return [];
    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      const updated = new Date(order.updatedAt);
      return (
        (created >= startDate && created <= endDate) ||
        (updated >= startDate && updated <= endDate)
      );
    });
  }, [orders, startDate, endDate]);

  const { totalRevenue, totalCost, profit, profitMargin } =
    calculateOrderStats(filteredOrders);

  const updateDateRange = (
    newRange: "7d" | "1m" | "1y" | "custom",
    customStart?: string,
    customEnd?: string
  ) => {
    let start: Date, end: Date;
    const today = new Date();

    if (newRange === "7d") {
      end = today;
      start = new Date();
      start.setDate(end.getDate() - 6);
    } else if (newRange === "1m") {
      end = today;
      start = new Date();
      start.setMonth(end.getMonth() - 1);
    } else if (newRange === "1y") {
      end = today;
      start = new Date();
      start.setFullYear(end.getFullYear() - 1);
    } else if (newRange === "custom" && customStart && customEnd) {
      start = new Date(customStart);
      end = new Date(customEnd);
    } else {
      return;
    }

    setStartDate(start);
    setEndDate(end);
    setRange(newRange);

    const params = new URLSearchParams(searchParams.toString());
    params.set("startDate", start.toISOString().split("T")[0]);
    params.set("endDate", end.toISOString().split("T")[0]);
    router.push(`?${params.toString()}`);
  };

  const statsData = [
    {
      title: "Total Revenue",
      value: `$ ${totalRevenue.toFixed(2)}`,
      color: "text-green-600",
    },
    {
      title: "Total Cost",
      value: `$ ${totalCost.toFixed(2)}`,
      color: "text-red-600",
    },
    {
      title: "Profit",
      value: `$ ${profit.toFixed(2)}`,
      color: "text-blue-600",
    },
    {
      title: "Profit Margin",
      value: profitMargin,
      isProgress: true,
      color: "text-green-600",
    },
  ];

  return (
    <section>
      {/* Date Range Selector */}
      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <select
          value={range}
          onChange={(e) =>
            updateDateRange(e.target.value as "7d" | "1m" | "1y" | "custom")
          }
          className="border rounded px-3 py-2"
        >
          <option value="7d">Last 7 Days</option>
          <option value="1m">Last 1 Month</option>
          <option value="1y">Last 1 Year</option>
          <option value="custom">Custom</option>
        </select>

        <input
          type="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          disabled={range !== "custom"}
          onChange={(e) =>
            updateDateRange(
              "custom",
              e.target.value,
              endDate?.toISOString().split("T")[0]
            )
          }
          className="border rounded px-3 py-2 disabled:opacity-50"
        />
        <input
          type="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          disabled={range !== "custom"}
          onChange={(e) =>
            updateDateRange(
              "custom",
              startDate?.toISOString().split("T")[0],
              e.target.value
            )
          }
          className="border rounded px-3 py-2 disabled:opacity-50"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl shadow-md bg-white px-5 py-6 flex flex-col justify-between transition hover:shadow-xl"
          >
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>

            {stat.isProgress ? (
              <div className="mt-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 mb-2">
                  <CircularProgressbar
                    value={stat.value as number}
                    text={`${stat.value}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      textColor: "#6C63FF",
                      pathColor: "#6C63FF",
                      trailColor: "#e5e7eb",
                    })}
                  />
                </div>
              </div>
            ) : (
              <p className={`mt-4 text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
