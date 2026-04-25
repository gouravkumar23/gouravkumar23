"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Helix() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 30;
  
  const spheres = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(i);
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.map((i) => {
        const y = (i - count / 2) * 1.5;
        const angle = i * 0.4;
        const x1 = Math.cos(angle) * 5;
        const z1 = Math.sin(angle) * 5;
        const x2 = Math.cos(angle + Math.PI) * 5;
        const z2 = Math.sin(angle + Math.PI) * 5;

        return (
          <group key={i}>
            <mesh position={[x1, y, z1]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#ff6400" emissive="#ff6400" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[x2, y, z2]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[(x1 + x2) / 2, y, (z1 + z2) / 2]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 10]} />
              <meshStandardMaterial color="#444" transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

const DNAHelix = () => {
  return (
    <div className="w-full h-[400px] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Helix />
      </Canvas>
    </div>
  );
};

export default DNAHelix;