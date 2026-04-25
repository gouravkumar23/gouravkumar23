"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function EnergyRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const spikesRef = useRef<THREE.Group>(null);

  // Create sparse energy spikes
  const spikes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const length = 1.5 + Math.random() * 2;
      temp.push({ angle, length });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      // Subtle pulse
      const s = 1 + Math.sin(t * 4) * 0.05;
      ringRef.current.scale.set(s, s, s);
    }

    if (spikesRef.current) {
      spikesRef.current.rotation.z = -t * 0.3;
      spikesRef.current.children.forEach((child, i) => {
        // Flickering effect for spikes
        const flicker = 0.8 + Math.sin(t * 10 + i) * 0.2;
        if (child instanceof THREE.Mesh) {
          child.scale.y = flicker;
          (child.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 15 + i) * 0.3;
        }
      });
    }
  });

  return (
    <group>
      {/* Main Neon Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.03, 16, 100]} />
        <meshBasicMaterial 
          color="#ff00ff" 
          transparent 
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary Inner Ring */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2.3, 0.01, 16, 100]} />
        <meshBasicMaterial 
          color="#8a2be2" 
          transparent 
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Energy Spikes */}
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
            <cylinderGeometry args={[0.01, 0.04, spike.length, 8]} />
            <meshBasicMaterial 
              color="#ff00ff" 
              transparent 
              opacity={0.6}
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
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none z-[30]">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        alpha={true}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#000000"]} />
        
        <Suspense fallback={null}>
          <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <EnergyRing />
          </Float>

          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
            color="#8a2be2"
          />

          {/* Unreal Bloom Post-processing */}
          <EffectComposer disableNormalPass>
            <Bloom 
              intensity={2.5} 
              luminanceThreshold={0.1} 
              luminanceSmoothing={0.9} 
              radius={0.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* Background Glow Layers */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-purple-900/20 blur-[180px] rounded-full -z-10" />
    </div>
  );
};

export default BottomOrb;