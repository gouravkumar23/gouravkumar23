"use client";
import React from "react";
import { motion } from "framer-motion";
import DNAHelix from "../dna-helix";
import { BoxReveal } from "../reveal-animations";
import { cn } from "@/lib/utils";

const EducationSection = () => {
  const education = [
    {
      degree: "Bachelor of Computer Science",
      institution: "Anurag University",
      year: "Expected 2026",
      details: "Data Science with Computer Science and Engineering.",
      cgpa: "8.79"
    },
    {
      degree: "Schooling",
      institution: "St. Francis De Sales High School",
      year: "2020",
      cgpa: "10/10"
    }
  ];

  return (
    <section id="education" className="max-w-7xl mx-auto py-20 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <BoxReveal width="100%">
            <h2 className={cn(
              "text-4xl md:text-7xl font-bold mb-12",
              "bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black/50 dark:from-white/80 dark:to-white/20"
            )}>
              Education
            </h2>
          </BoxReveal>
          
          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-brand">{edu.degree}</h3>
                <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">{edu.institution}</p>
                <div className="flex justify-between mt-2 text-sm text-zinc-500">
                  <span>{edu.year}</span>
                  <span className="font-bold">CGPA: {edu.cgpa}</span>
                </div>
                {edu.details && <p className="mt-4 text-zinc-600 dark:text-zinc-400">{edu.details}</p>}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <DNAHelix />
        </div>
      </div>
    </section>
  );
};

export default EducationSection;