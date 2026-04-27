"use client";

import React, { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SmoothScroll>
      <main className={cn("bg-slate-100 dark:bg-transparent relative min-h-screen")}>
        {/* Layer 1: Phoenix Bird (Base Layer) */}
        <div className="fixed inset-0 z-[10] pointer-events-none">
          <PhoenixModel />
        </div>

        {/* Layer 2: Interactive Keyboard (Middle Layer) */}
        <div className="fixed inset-0 z-[15] pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            <AnimatedBackground />
          </div>
        </div>

        {/* Layer 3: Page Content (Top Layer) */}
        <div className="relative z-[20] pointer-events-none">
          <HeroSection />
          <EducationSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <CertificatesSection />
          <LeadershipSection />
          <ContactSection />
        </div>
      </main>
    </SmoothScroll>
  );
}

export default MainPage;