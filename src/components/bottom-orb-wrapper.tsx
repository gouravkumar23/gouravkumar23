"use client";

import dynamic from "next/dynamic";
import React from "react";

const BottomOrb = dynamic(() => import("./bottom-orb"), { 
  ssr: false,
  loading: () => null
});

export default function BottomOrbWrapper() {
  return <BottomOrb />;
}