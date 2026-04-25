"use client";

import React, { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, useAnimations, Float } from "@react-three/drei";
import { motion } from "framer-motion";

function Model(props: any) {
  // The path is relative to the public directory
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  
  // Clone the scene to avoid issues with multiple instances if needed
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions, names } = useAnimations(animations, clonedScene);

  useEffect(() => {
    // Play the first available animation
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

  return <primitive object={clonedScene} {...props} />;
}

const PhoenixModel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.5 
      }}
      className="w-full h-[350px] md:h-[500px] cursor-grab active:cursor-grabbing relative z-10"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: 45, position: [0, 0, 5] }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.8} 
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
                <Model scale={0.8} />
              </Float>
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

// Pre-load the model to avoid jank
useGLTF.preload("/3dmodels/phoenix_bird/scene.gltf");

export default PhoenixModel;