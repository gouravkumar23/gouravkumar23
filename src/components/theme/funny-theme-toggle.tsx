"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { themeDisclaimers } from "@/data/constants";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function FunnyThemeToggle({
  className,
}: {
  className?: string;
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [counter, setCounter] = React.useState({ dark: 0, light: 0 });
  const { toast } = useToast();

  // Ensure component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("border-none bg-transparent opacity-0", className)}
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const goLight = () => {
    setCounter((prev) => ({ ...prev, light: prev.light + 1 }));
    setTheme("light");
  };
  
  const goDark = () => {
    const description =
      themeDisclaimers.dark[counter.dark % themeDisclaimers.dark.length];
    setCounter((prev) => ({ ...prev, dark: prev.dark + 1 }));
    toast({
      description: description,
      className:
        "top-0 right-0 flex fixed md:max-w-[420px] md:top-16 md:right-4",
    });
    setTheme("dark");
  };

  // Use resolvedTheme to determine the current visual state
  const isDark = resolvedTheme === "dark";

  return (
    <>
      {!isDark ? (
        <Button
          variant="outline"
          size="icon"
          className={cn("border-none bg-transparent", className)}
          onClick={goDark}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 pointer-events-none" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 pointer-events-none" />
          <span className="sr-only">Switch to Dark Mode</span>
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn("border-none bg-transparent", className)}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all duration-500" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500" />
              <span className="sr-only">Switch to Light Mode</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-[99999] flex flex-col items-center gap-2 p-4">
            <p className="text-sm text-center mb-2">
              {themeDisclaimers.light[counter.light % themeDisclaimers.light.length]}
            </p>
            <Button onClick={goLight} className="w-full">Go Light</Button>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}