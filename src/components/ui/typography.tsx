import React from "react";
import { cn } from "@/lib/utils";

export function TypographyH3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function TypographyP({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}