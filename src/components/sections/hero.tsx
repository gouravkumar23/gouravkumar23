"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { File, Github, Linkedin } from "lucide-react";
import { usePreloader } from "../preloader";
import { BlurIn, BoxReveal } from "../reveal-animations";
import ScrollDownIcon from "../scroll-down-icon";
import { config } from "@/data/config";
import LightningCubes from "../lightning-cubes";

const HeroSection = () => {
  const { isLoading } = usePreloader();

  return (
    <section id="hero" className={cn("relative w-full min-h-screen flex flex-col justify-center overflow-hidden pointer-events-none")}>
      <LightningCubes />
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-20 pb-32">
        <div className="z-[2] flex flex-col items-center lg:items-start text-center lg:text-left">
          {!isLoading && (
            <>
              <BlurIn delay={0.7}>
                <p className="font-thin text-md text-slate-500 dark:text-zinc-400 mb-2">
                  Hi, I am
                </p>
              </BlurIn>
              <BlurIn delay={1}>
                <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-800 dark:text-white leading-tight">
                  {config.author.split(" ")[0]}
                  <br />
                  <span className="text-brand">{config.author.split(" ").slice(1).join(" ")}</span>
                </h1>
              </BlurIn>
              <BlurIn delay={1.2}>
                <p className="mt-4 font-medium text-xl md:text-2xl text-slate-600 dark:text-zinc-300">
                  AI & Software Developer
                </p>
              </BlurIn>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto pointer-events-auto">
                <Link href="/resume24April2026.pdf" target="_blank" className="w-full sm:w-auto">
                  <BoxReveal delay={2} width="100%">
                    <Button className="flex items-center justify-center gap-2 w-full h-12 px-8 text-lg">
                      <File size={20} />
                      Resume
                    </Button>
                  </BoxReveal>
                </Link>
                <div className="flex gap-3 justify-center">
                  <Link href={config.social.github} target="_blank">
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Github size={24} />
                    </Button>
                  </Link>
                  <Link href={config.social.linkedin} target="_blank">
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Linkedin size={24} />
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="relative order-first lg:order-last h-[350px] sm:h-[450px] md:h-[550px] pointer-events-none" />
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
        <ScrollDownIcon />
      </div>
    </section>
  );
};

export default HeroSection;