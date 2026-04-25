"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function OrbModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3dmodels/energy_orb/scene.gltf");
  const { actions } = useAnimations(animations, group);

  // Apply the "hollow purple energy" look using a side-effect
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        
        // Hide any solid core or sphere-like objects in the center
        // We look for common names or small geometries
        if (mesh.name.toLowerCase().includes("core") || 
            mesh.name.toLowerCase().includes("center") || 
            mesh.name.toLowerCase().includes("inner")) {
          mesh.visible = false;
        }

        // Create a high-energy purple material
        const energyMaterial = new THREE.MeshStandardMaterial({
          color: "#000000", // Black base to prevent white reflections
          emissive: "#a855f7", // Vibrant purple
          emissiveIntensity: 10,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          wireframe: false,
        });

        mesh.material = energyMaterial;
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
      // Energetic rotation
      group.current.rotation.y += 0.015;
      group.current.rotation.z += 0.01;
      
      // Pulse effect
      const scale = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      group.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

const BottomOrb = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-80 pointer-events-none z-[30]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} alpha={true}>
        {/* Minimal ambient light to keep it dark */}
        <ambientLight intensity={0.1} />
        
        {/* Strong purple point lights to illuminate the "energy" */}
        <pointLight position={[5, 5, 5]} intensity={50} color="#bf00ff" />
        <pointLight position={[-5, -5, -5]} intensity={30} color="#7e22ce" />
        <pointLight position={[0, 0, 0]} intensity={20} color="#ff00ff" />
        
        <Suspense fallback={null}>
          <Float speed={5} rotationIntensity={2} floatIntensity={1.5}>
            <OrbModel />
          </Float>
          <ContactShadows 
            position={[0, -4, 0]} 
            opacity={0.8} 
            scale={15} 
            blur={3} 
            far={5} 
            color="#7e22ce"
          />
        </Suspense>
      </Canvas>
      
      {/* Enhanced CSS glow for the "hollow purple" vibe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-purple-600/20 blur-[160px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-magenta-500/30 blur-[80px] rounded-full -z-10" />
    </div>
  );
};

useGLTF.preload("/3dmodels/energy_orb/scene.gltf");

export default BottomOrb;