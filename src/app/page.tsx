"use client";

import React from "react";
import SmoothScroll from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/animated-background";
import SkillsSection from "@/components/sections/skills";
import ProjectsSection from "@/components/sections/projects";
import ContactSection from "@/components/sections/contact";
import HeroSection from "@/components/sections/hero";
import CertificatesSection from "@/components/sections/certificates";
import EducationSection from "@/components/sections/education";
import ExperienceSection from "@/components/sections/experience";
import LeadershipSection from "@/components/sections/leadership";
import dynamic from "next/dynamic";

const PhoenixModel = dynamic(() => import("@/components/phoenix-model"), { 
  ssr: false 
});

function MainPage() {
  return (
    <>
      <SmoothScroll>
        <main className={cn("bg-slate-100 dark:bg-transparent")}>
          {/* Background Keyboard */}
          <div className="top-0 z-0 fixed w-full h-screen">
            <AnimatedBackground />
          </div>

          {/* Revolving Phoenix */}
          <div className="fixed inset-0 z-[1] pointer-events-none">
            <PhoenixModel />
          </div>

          <HeroSection />
          <EducationSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <CertificatesSection />
          <LeadershipSection />
          <ContactSection />
        </main>
      </SmoothScroll>
    </>
  );
}

export default MainPage;