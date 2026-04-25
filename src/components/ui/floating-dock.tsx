"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
}

export const FloatingDock = ({ items, className }: { items: any[]; className?: string }) => {
  return (
    <div className={cn("flex items-center gap-4 p-2 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-md", className)}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.2, y: -5 }}
          className="relative group"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 text-xl">
            {item.icon}
          </div>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {item.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
};