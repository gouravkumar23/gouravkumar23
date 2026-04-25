"use client";

import React, { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

function Model(props: any) {
  const { scene } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  // Clone the scene to ensure it's a fresh instance for this component
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} {...props} />;
}

const PhoenixModel = () => {
  return (
    <div className="w-full h-[300px] md:h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: 45, position: [0, 0, 5] }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.AgXToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.7} 
            polar={[-0.1, Math.PI / 4]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Stage environment="city" intensity={0.5} contactShadow={false}>
              <Model scale={0.01} />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;