"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function OrbModel() {
  const group = useRef<THREE.Group>(null);
  // Load the model and its animations from the public folder
  const { scene, animations } = useGLTF("/3dmodels/energy_orb/scene.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play all animations found in the GLTF file
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        action?.reset().fadeIn(0.5).play();
      });
    }
  }, [actions]);

  useFrame((state) => {
    if (group.current) {
      // Subtle continuous rotation to keep it dynamic
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={2.5} 
        position={[0, 0, 0]} 
      />
    </group>
  );
}

const BottomOrb = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none z-[30]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} alpha={true}>
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#f43f5e" />
        
        <Suspense fallback={null}>
          <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
            <OrbModel />
          </Float>
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
        </Suspense>
      </Canvas>
      
      {/* Visual glow effect in CSS for extra pop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
    </div>
  );
};

// Preload the model to avoid jank during navigation
useGLTF.preload("/3dmodels/energy_orb/scene.gltf");

export default BottomOrb;