"use client";
import React from "react";
import { motion } from "framer-motion";
import { BoxReveal } from "../reveal-animations";
import { Users, Award } from "lucide-react";

const LeadershipSection = () => {
  const positions = [
    {
      title: "Chief Advisory Chair Person",
      org: "GeeksforGeeks Student Chapter, Anurag University",
      icon: <Award className="text-brand" />
    },
    {
      title: "President",
      org: "Data Analytics Club",
      details: "Led and organized 8 events, including a hackathon, with our teams.",
      icon: <Users className="text-brand" />
    }
  ];

  return (
    <section id="leadership" className="max-w-7xl mx-auto py-20 px-4">
      <BoxReveal width="100%">
        <h2 className="text-4xl md:text-7xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black/50 dark:from-white/80 dark:to-white/20">
          Leadership
        </h2>
      </BoxReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {positions.map((pos, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-brand transition-all"
          >
            <div className="mb-4 p-3 rounded-xl bg-brand/10 w-fit">
              {pos.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{pos.title}</h3>
            <p className="text-brand font-medium mb-4">{pos.org}</p>
            {pos.details && <p className="text-zinc-600 dark:text-zinc-400">{pos.details}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LeadershipSection;