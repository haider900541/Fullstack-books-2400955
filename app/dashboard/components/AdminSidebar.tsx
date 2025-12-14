"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getSetting } from "@/lib/actions/setting.actions";
import { ISetting } from "@/lib/database/models/setting.model";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Grid,
  Users,
  Shield,
  GalleryThumbnails,
  Tag,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Boxes,
    roles: ["admin"],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
    roles: ["admin"],
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Grid,
    roles: ["admin"],
  },
  {
    title: "Brands",
    url: "/dashboard/brands",
    icon: Tag,
    roles: ["admin"],
  },
  {
    title: "Sellers",
    url: "/dashboard/sellers",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Banners",
    url: "/dashboard/banners",
    icon: GalleryThumbnails,
    roles: ["admin"],
  },
  {
    title: "Admins",
    url: "/dashboard/admins",
    icon: Shield,
    roles: ["admin"],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

const AdminSidebar = ({
  role,
}: {
  role?: string;
}) => {
  const currentPath = usePathname();
  const [settings, setSettings] = useState<ISetting | null>(null);

  useEffect(() => {
    (async () => {
      const setting = await getSetting();
      setSettings(setting);
    })();
  }, []);

  const moderatorAllowed = ["Dashboard", "Products", "Orders"];

  return (
    <Sidebar
      className="text-[#3e0078] font-semibold font-serif"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup className="space-y-4">
          <SidebarGroupLabel>
            <a href={"/"} className="flex items-center gap-2">
              <Image
                src={settings?.logo || "/assets/images/logo.png"}
                width={40}
                height={40}
                alt={settings?.name || "Logo"}
              />
              <h1 className="text-lg font-serif font-bold text-[#3e0078]">
                <span className="text-[#3e0078]">
                  {settings?.name?.split(" ")[0]}
                </span>
                <span className="text-black">
                  {" "}
                  {settings?.name?.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </a>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarItems
                .filter((item) => {
                  if (role === "Admin") {
                    return item.roles.includes("admin");
                  } else if (role === "Moderator") {
                    return (
                      item.roles.includes("admin") &&
                      moderatorAllowed.includes(item.title)
                    );
                  }
                  return false;
                })
                .map((item) => {
                  const isActive =
                    item.url === "/dashboard"
                      ? currentPath === item.url
                      : currentPath === item.url ||
                        currentPath.startsWith(`${item.url}/`);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                            isActive ? "bg-[#3e0078] text-white" : ""
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
