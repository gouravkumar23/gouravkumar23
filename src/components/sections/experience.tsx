"use client";
import React from "react";
import { motion } from "framer-motion";
import { BoxReveal } from "../reveal-animations";
import { Briefcase } from "lucide-react";

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Software Development Intern",
      company: "DRDO – Research Centre Imarat (RCI), Hyderabad",
      duration: "Jul 2025 - Aug 2025",
      responsibilities: [
        "Developing a C-based software system to interface with and store data from defense-grade hardware protocols such as RS-422 and MIL-STD-1553.",
        "Implementing a native Windows GUI using WinAPI for real-time visualization, control, and diagnostics of connected hardware.",
        "Collaborating with hardware teams to ensure accurate data interpretation, protocol compliance, and low-latency performance."
      ]
    }
  ];

  return (
    <section id="experience" className="max-w-7xl mx-auto py-20 px-4">
      <BoxReveal width="100%">
        <h2 className="text-4xl md:text-7xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black/50 dark:from-white/80 dark:to-white/20">
          Experience
        </h2>
      </BoxReveal>

      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative pl-8 md:pl-12 border-l-2 border-brand/30"
          >
            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
              <Briefcase size={12} className="text-white" />
            </div>
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                  <p className="text-brand font-medium">{exp.company}</p>
                </div>
                <span className="text-zinc-500 text-sm mt-2 md:mt-0">{exp.duration}</span>
              </div>
              <ul className="space-y-4">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-3 text-zinc-600 dark:text-zinc-400">
                    <span className="text-brand mt-1.5">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;