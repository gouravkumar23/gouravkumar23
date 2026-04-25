"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { certificates } from "@/data/certificates";
import { cn } from "@/lib/utils";
import { BoxReveal } from "../reveal-animations";

const CertificatesSection = () => {
  return (
    <section id="certificates" className="max-w-7xl mx-auto py-20 px-4 pointer-events-none">
      <Link href={"#certificates"} className="pointer-events-auto">
        <BoxReveal width="100%">
          <h2
            className={cn(
              "bg-clip-text text-4xl text-center text-transparent md:text-7xl mb-16",
              "bg-gradient-to-b from-black/80 to-black/50",
              "dark:bg-gradient-to-b dark:from-white/80 dark:to-white/20 dark:bg-opacity-50"
            )}
          >
            Certificates
          </h2>
        </BoxReveal>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="pointer-events-auto"
          >
            <Link
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-brand transition-all duration-300 h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-brand/10 text-brand">
                  <Award size={24} />
                </div>
                <ExternalLink size={18} className="text-zinc-400 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-brand transition-colors line-clamp-2">
                {cert.name}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                {cert.issuer}
              </p>
              <p className="text-xs text-zinc-500">
                {cert.date}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CertificatesSection;