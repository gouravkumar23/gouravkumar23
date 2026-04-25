"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

const ElasticCursor = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { damping: 20, stiffness: 250 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const springScale = useSpring(scale, { damping: 12, stiffness: 300 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => {
      animate(scale, 2.5, { duration: 0.05, ease: "easeOut" });
    };

    const handleMouseUp = () => {
      animate(scale, 1, { duration: 0.3, ease: "backOut" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, scale]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 border-2 border-brand rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x,
        y,
        scale: springScale,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div className="absolute inset-0 m-auto w-1 h-1 bg-brand rounded-full" />
    </motion.div>
  );
};

export default ElasticCursor;