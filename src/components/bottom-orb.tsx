"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function OrbModel() {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { scene, animations } = useGLTF("/3dmodels/energy_orb/scene.gltf");
  const { actions } = useAnimations(animations, group);

  // Apply the "shattered energy" look
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        
        // Hide solid inner parts to keep it hollow
        if (mesh.name.toLowerCase().includes("core") || 
            mesh.name.toLowerCase().includes("center") || 
            mesh.name.toLowerCase().includes("inner")) {
          mesh.visible = false;
        }

        // Create a sharp, crystalline energy material
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#000000",
          emissive: "#a855f7",
          emissiveIntensity: 20,
          transparent: true,
          opacity: 0.7,
          wireframe: true, // Gives it that sharp, shattered look from the image
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
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
      // Fast, chaotic rotation for energy effect
      group.current.rotation.y += 0.02;
      group.current.rotation.z += 0.015;
      group.current.rotation.x += 0.01;
      
      // Pulse the whole group
      const s = 3.5 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      group.current.scale.set(s, s, s);
    }
    
    if (ringRef.current) {
      // Rotate the ring separately
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* The bright circular ring seen in the image */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#bf00ff" 
          emissiveIntensity={50} 
          toneMapped={false}
        />
      </mesh>
      
      {/* The shattered shards */}
      <primitive object={scene} />
    </group>
  );
}

const BottomOrb = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-[30]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} alpha={true}>
        <ambientLight intensity={0.1} />
        
        {/* High intensity point lights for the glow */}
        <pointLight position={[0, 0, 0]} intensity={100} color="#bf00ff" distance={15} />
        <pointLight position={[5, 5, 5]} intensity={50} color="#7e22ce" />
        
        <Suspense fallback={null}>
          <Float speed={6} rotationIntensity={2} floatIntensity={2}>
            <OrbModel />
          </Float>
          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={1} 
            scale={20} 
            blur={4} 
            far={6} 
            color="#7e22ce"
          />
        </Suspense>
      </Canvas>
      
      {/* Intense CSS glow layers */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-purple-600/30 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-magenta-500/40 blur-[100px] rounded-full -z-10" />
    </div>
  );
};

useGLTF.preload("/3dmodels/energy_orb/scene.gltf");

export default BottomOrb;