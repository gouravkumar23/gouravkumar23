"use client";

import React, { Suspense, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, useAnimations } from "@react-three/drei";

function Model(props: any) {
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    // Play the first animation found in the GLTF file
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }
  }, [actions]);

  return <primitive object={clonedScene} {...props} />;
}

const PhoenixModel = () => {
  return (
    <div 
      className="w-full h-[250px] md:h-[400px] cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ fov: 45, position: [0, 0, 5] }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        
        <Suspense fallback={null}>
          <PresentationControls 
            speed={1.5} 
            global 
            zoom={0.7} 
            polar={[-0.1, Math.PI / 4]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Stage environment="city" intensity={0.5} contactShadow={false} adjustCamera={true}>
              {/* Reduced scale from 1 to 0.7 to make it smaller */}
              <Model scale={0.7} />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;