"use client";
import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const ModalTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalTrigger must be used within Modal");
  return (
    <button className={cn("", className)} onClick={() => context.setOpen(true)}>
      {children}
    </button>
  );
};

export const ModalBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalBody must be used within Modal");

  return (
    <AnimatePresence>
      {context.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => context.setOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative z-[101] w-full max-w-lg bg-white dark:bg-zinc-900 p-6 shadow-xl rounded-2xl",
              className
            )}
          >
            <button
              onClick={() => context.setOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("py-4", className)}>{children}</div>;
};

export const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800", className)}>
      {children}
    </div>
  );
};