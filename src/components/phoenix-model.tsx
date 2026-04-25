"use client";

import React, { Suspense, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, useAnimations, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

function Model({ scale = 0.8, ...props }: any) {
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions, names } = useAnimations(animations, clonedScene);

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

  return <primitive object={clonedScene} scale={scale} {...props} />;
}

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.5 
      }}
      className="w-full h-[300px] sm:h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing relative z-10"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: isMobile ? 50 : 45, position: [0, 0, 5] }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={isMobile ? 0.8 : 1.5} 
            global 
            zoom={isMobile ? 0.7 : 0.8} 
            polar={[-0.1, Math.PI / 4]}
            rotation={[0, -Math.PI / 6, 0]}
            config={{ mass: 1, tension: 170, friction: 26 }}
          >
            <Stage 
              environment="city" 
              intensity={0.6} 
              contactShadow={false} 
              adjustCamera={true}
            >
              <Float
                speed={2} 
                rotationIntensity={0.5} 
                floatIntensity={0.5}
              >
                <Model scale={isMobile ? 0.6 : 0.8} />
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