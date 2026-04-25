"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

function Model(props: any) {
  // Ensure the path is correct for the public folder
  const { scene } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
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
        // Removed explicit THREE imports here to prevent multiple instance warnings
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.8} 
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