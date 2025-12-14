"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import ScrollHeaderWrapper from "@/components/shared/ScrollHeaderWrapper";
import { Toaster } from "react-hot-toast";
import SearchDrawer from "@/components/shared/SearchDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setHeaderHeight(headerRef.current!.offsetHeight);
      });

      resizeObserver.observe(headerRef.current);
      setHeaderHeight(headerRef.current.offsetHeight);

      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Toaster />
      <ScrollHeaderWrapper>
        <div ref={headerRef}>
          <Header openSearch={() => setSearchOpen(true)} />
        </div>
      </ScrollHeaderWrapper>

      <main style={{ paddingTop: headerHeight }} className="flex-1">
        {children}
      </main>

      <SearchDrawer
        open={searchOpen}
        onOpenChange={setSearchOpen}
        headerHeight={headerHeight}
      />

      <Footer />
    </div>
  );
}
