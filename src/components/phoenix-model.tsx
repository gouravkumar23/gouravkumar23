"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, useAnimations, Float, Html } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Model({ scale = 1, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const { actions, names } = useAnimations(animations, group);

  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#1e1b4b",
          wireframe: true,
          transparent: true,
          opacity: 0.6,
          emissive: "#6366f1",
          emissiveIntensity: 0.8,
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && names.length > 0) {
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  useEffect(() => {
    if (!group.current) return;

    // Scroll-based revolution animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    tl.to(group.current.position, {
      x: -3,
      y: 1,
      z: -2,
      ease: "none",
    })
    .to(group.current.rotation, {
      y: Math.PI * 2,
      ease: "none",
    }, 0)
    .to(group.current.position, {
      x: 3,
      y: -1,
      z: 0,
      ease: "none",
    })
    .to(group.current.rotation, {
      y: Math.PI * 4,
      ease: "none",
    }, ">")
    .to(group.current.position, {
      x: 0,
      y: 0,
      z: -1,
      ease: "none",
    })
    .to(group.current.rotation, {
      y: Math.PI * 6,
      ease: "none",
    }, ">");

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame((state) => {
    if (group.current) {
      // Subtle hover effect on top of scroll
      group.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={scale} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
        {...props} 
      />
    </group>
  );
}

const Loader = () => (
  <Html center>
    <div className="text-indigo-400 font-mono text-xs whitespace-nowrap animate-pulse">
      CALIBRATING NEBULA...
    </div>
  </Html>
);

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: isMobile ? 60 : 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        
        <Suspense fallback={<Loader />}>
          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <Model scale={isMobile ? 0.005 : 0.008} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;