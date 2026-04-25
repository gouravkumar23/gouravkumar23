"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function EnergyRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const spikesRef = useRef<THREE.Group>(null);

  const spikes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      length: 1.5 + Math.random() * 2,
      speed: 5 + Math.random() * 5,
      offset: Math.random() * Math.PI
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
      const s = 1 + Math.sin(t * 2) * 0.02;
      ringRef.current.scale.set(s, s, s);
    }

    if (spikesRef.current) {
      spikesRef.current.rotation.z = -t * 0.1;
      spikesRef.current.children.forEach((child, i) => {
        const spike = spikes[i];
        if (child instanceof THREE.Mesh) {
          const flicker = 0.9 + Math.sin(t * spike.speed + spike.offset) * 0.1;
          child.scale.y = flicker;
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = (0.4 + Math.sin(t * 8 + i) * 0.2) * flicker;
          }
        }
      });
    }
  });

  return (
    <group>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial 
          color="#ff00ff" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.45, 0.01, 16, 100]} />
        <meshBasicMaterial 
          color="#8a2be2" 
          transparent 
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

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
            <cylinderGeometry args={[0.005, 0.02, spike.length, 6]} />
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

export default function BottomOrb() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none z-[30]">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true
        }}
      >
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <EnergyRing />
          </Float>

          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={0.2} 
            scale={15} 
            blur={3} 
            far={4.5} 
            color="#8a2be2"
          />

          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom 
              intensity={2.5} 
              luminanceThreshold={0.1} 
              luminanceSmoothing={0.9} 
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-purple-900/5 blur-[150px] rounded-full -z-10" />
    </div>
  );
}