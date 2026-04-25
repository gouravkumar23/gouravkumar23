"use client";

import React, { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, useAnimations, Float, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";

function Model({ scale = 1, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
    return () => {
      if (actions && names.length > 0) {
        actions[names[0]]?.fadeOut(0.5);
      }
    };
  }, [actions, names]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={clonedScene} scale={scale} {...props} />
    </group>
  );
}

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 1.5, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.5 
      }}
      className="w-full h-[350px] sm:h-[450px] md:h-[550px] cursor-grab active:cursor-grabbing relative z-10"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        shadows 
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={isMobile ? 55 : 45} />
        
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff6400" />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.8} 
            polar={[-0.1, Math.PI / 4]}
            rotation={[0, -Math.PI / 4, 0]}
            config={{ mass: 2, tension: 400, friction: 26 }}
          >
            <Stage 
              environment="city" 
              intensity={0.5} 
              contactShadow={{ opacity: 0.4, blur: 2 }}
              adjustCamera={false}
            >
              <Float
                speed={2.5} 
                rotationIntensity={0.4} 
                floatIntensity={0.6}
                floatingRange={[-0.2, 0.2]}
              >
                <Model scale={isMobile ? 0.008 : 0.012} />
              </Float>
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

useGLTF.preload("/3dmodels/phoenix_bird/scene.gltf");

export default PhoenixModel;