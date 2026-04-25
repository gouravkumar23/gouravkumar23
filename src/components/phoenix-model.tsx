"use client";

import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

function Model(props: any) {
  // The model is now in the public directory
  const { scene } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  return <primitive object={scene} {...props} />;
}

const PhoenixModel = () => {
  return (
    <div className="w-full h-[300px] md:h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: 45 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping;
        }}
      >
        <color attach="background" args={["transparent"]} />
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.5} 
            polar={[-0.1, Math.PI / 4]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Stage environment="city" intensity={0.5}>
              <Model scale={0.01} />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;