"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ElasticCursor = () => {
  const jellyRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleClick = () => {
      if (!jellyRef.current) return;

      gsap.killTweensOf(jellyRef.current);

      gsap.fromTo(
        jellyRef.current,
        { scale: 1 },
        {
          scale: 2,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.to(jellyRef.current, { scale: 1, duration: 0.15, ease: "power2.inOut" });
          }
        }
      );
    };

    window.addEventListener("mousemove", setFromEvent);
    window.addEventListener("mousedown", handleClick);

    const xSet = gsap.quickSetter(jellyRef.current, "x", "px");
    const ySet = gsap.quickSetter(jellyRef.current, "y", "px");

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());

      pos.current.x += (mouse.current.x - pos.current.x) * dt;
      pos.current.y += (mouse.current.y - pos.current.y) * dt;

      xSet(pos.current.x);
      ySet(pos.current.y);

      // Jelly effect on movement
      if (Math.abs(mouse.current.x - pos.current.x) > 0.1 || Math.abs(mouse.current.y - pos.current.y) > 0.1) {
        gsap.timeline({ overwrite: "auto" })
          .to(jellyRef.current, {
            scaleX: 1.4,
            scaleY: 0.6,
            duration: 0.12,
            ease: "power2.out",
          })
          .to(jellyRef.current, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.2,
            ease: "elastic.out(1, 0.4)",
          });
      }
    });

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div
      ref={jellyRef}
      className="fixed top-0 left-0 w-8 h-8 border-2 border-brand rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div className="w-1 h-1 bg-brand rounded-full" />
    </div>
  );
};

export default ElasticCursor;