"use client";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { opacity, slideUp } from "./anim";
import { usePreloader } from ".";

export default function Index() {
  const { isLoading, loadingPercent } = usePreloader();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          {/* Scanning Line Effect */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-[2px] bg-brand/50 z-50 shadow-[0_0_15px_rgba(255,100,0,0.8)]"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-mono tracking-widest text-brand">SYSTEM INITIALIZING...</h2>
            </motion.div>
            
            <motion.p variants={opacity} initial="initial" animate="enter" className="text-7xl font-bold">
              {(loadingPercent - (loadingPercent % 5)).toFixed(0)} %
            </motion.p>
          </div>

          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
              fill="currentColor"
              className="text-background"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}