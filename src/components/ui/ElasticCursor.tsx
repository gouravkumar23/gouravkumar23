"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { useMouse } from "@/hooks/use-mouse";

const ElasticCursor = () => {
  const [mounted, setMounted] = useState(false);
  const { x: mouseXPos, y: mouseYPos, angle, acceleration } = useMouse({ 
    allowAngle: true, 
    allowAcc: true,
    allowPage: false 
  });

  const clickScale = useMotionValue(1);
  
  const springConfig = { damping: 20, stiffness: 250 };
  const x = useSpring(mouseXPos, springConfig);
  const y = useSpring(mouseYPos, springConfig);
  const springScale = useSpring(clickScale, { damping: 12, stiffness: 300 });

  useEffect(() => {
    setMounted(true);

    const handleMouseDown = () => {
      animate(clickScale, 2.5, { duration: 0.05, ease: "easeOut" });
    };

    const handleMouseUp = () => {
      animate(clickScale, 1, { duration: 0.3, ease: "backOut" });
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [clickScale]);

  if (!mounted) return null;

  // Calculate stretch based on acceleration
  const stretch = 1 + acceleration / 500;

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 border-2 border-brand rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{
        x,
        y,
        scale: springScale,
        translateX: "-50%",
        translateY: "-50%",
        rotate: angle + "rad",
        scaleX: stretch,
      }}
    >
      <div className="w-1 h-1 bg-brand rounded-full" />
    </motion.div>
  );
};

export default ElasticCursor;