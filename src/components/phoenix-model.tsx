"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, useAnimations, Float, PerspectiveCamera, Html } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";

function Model({ scale = 1, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  useFrame((state) => {
    if (group.current) {
      // Subtle hover effect instead of full rotation
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={group} dispose={null} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} scale={scale} {...props} />
    </group>
  );
}

const Loader = () => (
  <Html center>
    <div className="text-zinc-500 font-mono text-xs whitespace-nowrap animate-pulse">
      LOADING PHOENIX...
    </div>
  </Html>
);

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: isMobile ? 55 : 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff6400" />
        
        <Suspense fallback={<Loader />}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.8} 
            polar={[-0.1, Math.PI / 4]}
            rotation={[0, 0, 0]}
          >
            <Stage environment="city" intensity={0.5} contactShadow={false}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Model scale={isMobile ? 0.008 : 0.012} />
              </Float>
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;