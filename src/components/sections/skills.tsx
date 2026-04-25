import Link from "next/link";
import React from "react";
import { BoxReveal } from "../reveal-animations";
import { cn } from "@/lib/utils";

const SkillsSection = () => {
  return (
    <section id="skills" className="w-full min-h-[180dvh] px-4 pt-48 md:pt-80 pb-32">
      <div className="top-[150px] sticky mb-64 md:mb-[500px]">
        <Link href={"#skills"}>
          <BoxReveal width="100%">
            <h2
              className={cn(
                "bg-clip-text text-4xl text-center text-transparent md:text-7xl",
                "bg-gradient-to-b from-black/80 to-black/50",
                "dark:bg-gradient-to-b dark:from-white/80 dark:to-white/20 dark:bg-opacity-50 "
              )}
            >
              SKILLS
            </h2>
          </BoxReveal>
        </Link>
        <p className="mx-auto mt-4 line-clamp-4 max-w-3xl font-normal text-sm md:text-base text-center text-neutral-500 dark:text-neutral-400">
          (hint: press a key or hover over them)
        </p>
      </div>
    </section>
  );
};

export default SkillsSection;