"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ISetting } from "@/lib/database/models/setting.model";
import { getSetting } from "@/lib/actions/setting.actions";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ISetting | null>(null);

  useEffect(() => {
    (async () => {
      const setting = await getSetting();
      setSettings(setting);
    })();
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <nav className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="align-middle">
          <Menu />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col gap-6 bg-white lg:hidden w-11/12"
        >
          <a
            href={"/"}
            className="flex items-center gap-2"
            onClick={handleClose}
          >
            <Image
              src={settings?.logo || "/assets/images/logo.png"}
              alt={settings?.name || "Logo"}
              width={30}
              height={30}
            />
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              <span className="text-primary-600">
                {settings?.name?.split(" ")[0]}
              </span>
              <span className="text-black">
                {" "}
                {settings?.name?.split(" ").slice(1).join(" ")}
              </span>
            </h1>
          </a>
          <Separator className="border border-[#3e0078]" />
          <NavItems onItemSelected={handleClose} />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
