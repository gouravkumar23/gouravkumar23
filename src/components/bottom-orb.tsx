"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function OrbModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3dmodels/energy_orb/scene.gltf");
  const { actions } = useAnimations(animations, group);

  // Apply the "hollow purple energy" look
  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        
        // Hide the core/center if it exists to make it "empty in middle"
        if (mesh.name.toLowerCase().includes("core") || 
            mesh.name.toLowerCase().includes("center") || 
            mesh.name.toLowerCase().includes("sphere")) {
          mesh.visible = false;
          return;
        }

        if (mesh.material) {
          mesh.material = mesh.material.clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          
          // Deep purple base with bright magenta/purple glow
          mat.color.set("#2e004f"); 
          mat.emissive.set("#bf00ff"); 
          mat.emissiveIntensity = 15; // High intensity for that "energy" look
          mat.transparent = true;
          mat.opacity = 0.8;
          mat.side = THREE.DoubleSide;
          
          // Additive blending helps with the "glow" effect seen in the image
          mat.blending = THREE.AdditiveBlending;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        action?.reset().fadeIn(0.5).play();
      });
    }
  }, [actions]);

  useFrame((state) => {
    if (group.current) {
      // Faster rotation for a more energetic feel
      group.current.rotation.y += 0.01;
      group.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={3} 
        position={[0, 0, 0]} 
      />
    </group>
  );
}

const BottomOrb = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none z-[30]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} alpha={true}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={20} color="#bf00ff" />
        <pointLight position={[-5, -5, -5]} intensity={10} color="#4b0082" />
        
        <Suspense fallback={null}>
          <Float speed={4} rotationIntensity={1} floatIntensity={1}>
            <OrbModel />
          </Float>
          <ContactShadows 
            position={[0, -3, 0]} 
            opacity={0.6} 
            scale={10} 
            blur={3} 
            far={4} 
            color="#bf00ff"
          />
        </Suspense>
      </Canvas>
      
      {/* Stronger purple glow at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-40 bg-purple-600/20 blur-[140px] rounded-full -z-10" />
    </div>
  );
};

useGLTF.preload("/3dmodels/energy_orb/scene.gltf");

export default BottomOrb;