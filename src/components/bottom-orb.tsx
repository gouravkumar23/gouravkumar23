"use client";

import React, { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function EnergyRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const spikesRef = useRef<THREE.Group>(null);

  // Create sparse energy spikes with stable random values
  const spikes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      length: 1.5 + Math.random() * 2,
      speed: 8 + Math.random() * 8,
      offset: Math.random() * Math.PI
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      const s = 1 + Math.sin(t * 3) * 0.03;
      ringRef.current.scale.set(s, s, s);
    }

    if (spikesRef.current) {
      spikesRef.current.rotation.z = -t * 0.2;
      spikesRef.current.children.forEach((child, i) => {
        const spike = spikes[i];
        if (child instanceof THREE.Mesh) {
          const flicker = 0.8 + Math.sin(t * spike.speed + spike.offset) * 0.2;
          child.scale.y = flicker;
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = (0.3 + Math.sin(t * 10 + i) * 0.2) * flicker;
          }
        }
      });
    }
  });

  return (
    <group>
      {/* Main Neon Ring - Thin and clean */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.025, 16, 100]} />
        <meshBasicMaterial 
          color="#ff00ff" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary Inner Ring - Very thin */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.4, 0.01, 16, 100]} />
        <meshBasicMaterial 
          color="#8a2be2" 
          transparent 
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Energy Spikes - Radiating outward */}
      <group ref={spikesRef}>
        {spikes.map((spike, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(spike.angle) * 2.5, 
              Math.sin(spike.angle) * 2.5, 
              0
            ]}
            rotation={[0, 0, spike.angle + Math.PI / 2]}
          >
            <cylinderGeometry args={[0.005, 0.03, spike.length, 6]} />
            <meshBasicMaterial 
              color="#ff00ff" 
              transparent 
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const BottomOrb = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none z-[30]">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        alpha={true}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: true
        }}
      >
        <Suspense fallback={null}>
          <Float speed={3} rotationIntensity={0.4} floatIntensity={0.8}>
            <EnergyRing />
          </Float>

          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={0.3} 
            scale={15} 
            blur={3} 
            far={4.5} 
            color="#8a2be2"
          />

          <EffectComposer multisampling={0}>
            <Bloom 
              intensity={2.2} 
              luminanceThreshold={0.15} 
              luminanceSmoothing={0.9} 
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* Background Glow Layers */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-purple-900/10 blur-[180px] rounded-full -z-10" />
    </div>
  );
};

export default BottomOrb;