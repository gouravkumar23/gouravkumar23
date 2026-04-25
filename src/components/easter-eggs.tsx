"use client";
import { useDevToolsOpen } from "@/hooks/use-devtools-open";
import React, { useEffect } from "react";
import NyanCat from "./nyan-cat";
import { config } from "@/data/config";

const EasterEggs = () => {
  const { isDevToolsOpen } = useDevToolsOpen();
  
  useEffect(() => {
    if (!isDevToolsOpen) return;

    if (typeof console !== "undefined") {
      console.clear();
      console.log(
        "%cWhoa, look at you! 🕵️‍♂️\n" +
          "You seem to have discovered the secret console! 🔍\n" +
          "Want to see some magic? ✨\n" +
          "Just type %cmy first name%c and hit enter! 🎩🐇",
        "color: #FFD700; font-size: 16px; font-weight: bold; background-color: black; padding: 10px; border-radius: 10px; margin-top:20px",
        "color: #00FF00; font-size: 16px; font-weight: bold; background-color: black; padding: 10px; border-radius: 10px; margin-top:20px",
        "color: #FFD700; font-size: 16px; font-weight: bold; background-color: black; padding: 10px; border-radius: 10px;"
      );

      const firstName = config.author.split(" ")[0].toLowerCase();
      const lastName = config.author.split(" ").pop()?.toLowerCase() || "";
      const fullName = config.author.replace(/\s+/g, '').toLowerCase();

      [firstName, lastName, fullName].forEach((name) => {
        if (!name) return;
        // @ts-ignore
        if (Object.hasOwn(window, name)) return;
        
        Object.defineProperty(window, name, {
          get() {
            console.log(
              `%c✨ Abra Kadabra! ✨\n\n` +
                `You just summoned the magic of ${config.author.split(" ")[0]}! 🧙‍♂️\n` +
                `What??? you're not impressed? Fine, but remember: With great power comes great responsibility! 💻⚡`,
              "color: #FF4500; font-size: 18px; font-weight: bold; background-color: black; padding: 10px; border-radius: 10px; margin-top:10px"
            );

            const timer = setTimeout(() => {
              console.log(
                "%cPssttt! 🤫\n\n" +
                  "Do you like cats?? 😺 If yes, then press 'n' on viewport and see what happens! 🐱✨",
                "color: #FF69B4; font-size: 16px; font-weight: bold; background-color: black; padding: 10px; border-radius: 10px;"
              );
              clearTimeout(timer);
            }, 5000);
            return "";
          },
          configurable: true
        });
      });
    }
  }, [isDevToolsOpen]);

  return (
    <>
      <NyanCat />
    </>
  );
};

export default EasterEggs;