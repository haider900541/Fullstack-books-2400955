"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
  label?: string;
}

export default function Loader({ className, size = 40, label = "Loading..." }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen gap-4 text-center", className)}>
      <Loader2
        className="animate-spin text-primary"
        style={{ width: size, height: size }}
        aria-label="Loading spinner"
      />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
