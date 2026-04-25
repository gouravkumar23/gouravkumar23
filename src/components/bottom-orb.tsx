"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrbModel() {
  const group = useRef<THREE.Group>(null);
  // Using the energy_orb model from your 3dmodels folder
  const { scene } = useGLTF("/3dmodels/energy_orb/scene.gltf");

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
      group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={1.5} 
        position={[0, 0, 0]} 
      />
      {/* Adding a glow effect */}
      <mesh scale={2}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#6366f1"
          speed={2}
          distort={0.4}
          radius={1}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

const BottomOrb = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-40 pointer-events-none z-[30]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} alpha={true}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <OrbModel />
          </Float>
        </Suspense>
      </Canvas>
      {/* Subtle floor glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 blur-[100px] rounded-full -z-10" />
    </div>
  );
};

export default BottomOrb;