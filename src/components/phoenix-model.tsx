"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

function Model(props: any) {
  const { scene } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} {...props} />;
}

const PhoenixModel = () => {
  return (
    <div 
      className="w-full h-[300px] md:h-[500px] cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: 45, position: [0, 0, 5] }}
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
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Stage environment="city" intensity={0.6} contactShadow={false} adjustCamera={true}>
              <Model scale={1} />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;