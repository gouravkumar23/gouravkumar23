"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

const InteractiveGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const springScale = useSpring(scale, { damping: 15, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.touches[0].clientX - rect.left);
      mouseY.set(e.touches[0].clientY - rect.top);
    };

    const handleMouseDown = () => {
      animate(scale, 2.5, { duration: 0.1, ease: "easeOut" });
    };

    const handleMouseUp = () => {
      animate(scale, 1, { duration: 0.4, ease: "backOut" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, scale]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none"
    >
      <div 
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #888 1px, transparent 1px),
            linear-gradient(to bottom, #888 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          transform: "perspective(1000px) rotateX(60deg) scale(2)",
          transformOrigin: "center top",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{
          x,
          y,
          scale: springScale,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(var(--brand-rgb), 0.4) 0%, transparent 70%)",
          backgroundColor: "rgba(255, 100, 0, 0.15)",
        }}
      />
    </div>
  );
};

export default InteractiveGrid;