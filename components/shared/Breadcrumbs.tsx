"use client";

import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const isMongoId = (segment: string) => /^[a-f\d]{24}$/i.test(segment);

  const segments = pathname
    .split("/")
    .filter((segment) => segment && !isMongoId(segment));

  const createBreadcrumbLabel = (segment: string) =>
    decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <nav className="text-sm text-[#3e0078] px-1 mb-4 no-print" aria-label="Breadcrumb">
      <div className="w-full overflow-hidden">
        <ol className="flex items-center space-x-1 text-ellipsis whitespace-nowrap overflow-hidden min-w-0">
          {/* Home link */}
          <li className="flex items-center shrink-0">
            <a
              href={"/"}
              className="flex items-center text-[#3e0078] hover:underline transition-colors"
            >
              <Home size={16} className="mr-1" />
              <span className="hidden sm:inline">Home</span>
            </a>
          </li>

          {/* Segments */}
          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;

            return (
              <li
                key={href}
                className="flex items-center shrink-0 text-ellipsis overflow-hidden"
              >
                <ChevronRight size={16} className="mx-1 text-[#3e0078]" />
                {isLast ? (
                  <span className="text-[#3e0078] truncate">
                    {createBreadcrumbLabel(segment)}
                  </span>
                ) : (
                  <a
                    href={href}
                    className="text-[#3e0078] hover:underline transition-colors truncate"
                  >
                    {createBreadcrumbLabel(segment)}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
