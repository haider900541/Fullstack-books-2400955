"use client";

import { headerLinks } from "@/constants";
import { usePathname } from "next/navigation";

interface NavItemsProps {
  onItemSelected?: () => void;
}

const NavItems = ({ onItemSelected }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <ul className="lg:flex-between flex w-full flex-col lg:gap-5 items-start lg:flex-row font-serif">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li
            key={link.route}
            className={`${
              isActive &&
              "text-white lg:text-primary bg-[#3e0078] lg:bg-white/20 rounded-md"
            } flex-center p-medium-20 whitespace-nowrap px-2 py-2 lg:py-1 border-b border-gray-300 lg:border-0 
            w-full lg:w-auto hover:bg-[#3e0078] lg:hover:bg-white/20 hover:text-white cursor-pointer hover:rounded-md`}
          >
            <a href={link.route} onClick={onItemSelected}>
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
