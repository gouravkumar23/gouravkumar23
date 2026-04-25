"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Html, PresentationControls, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DustParticles({ count = 500 }) {
  const points = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.001;
      points.current.rotation.x += 0.0005;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Model({ scale = 1, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const meshGroup = useRef<THREE.Group>(null);
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // Looping flight path: Hero -> Right Corner (Fade) -> Left Corner (Enter) -> Center
    tl.to(group.current.position, { x: 4, y: 1, z: -2, duration: 2 })
      .to(group.current.rotation, { y: Math.PI * 0.5, duration: 2 }, 0)
      .to(meshGroup.current?.scale || {}, { x: 0, y: 0, z: 0, duration: 0.5 }, ">") // Fade out at right
      
      .set(group.current.position, { x: -6, y: -1, z: -1 }) // Teleport to left
      .to(meshGroup.current?.scale || {}, { x: 1, y: 1, z: 1, duration: 0.5 }, ">") // Fade in at left
      
      .to(group.current.position, { x: 0, y: 0, z: 0, duration: 2 }, ">")
      .to(group.current.rotation, { y: Math.PI * 2, duration: 2 }, "<")
      
      .to(group.current.position, { x: 5, y: 2, z: -3, duration: 2 }, ">") // Exit right again
      .to(meshGroup.current?.scale || {}, { x: 0, y: 0, z: 0, duration: 0.5 }, ">");

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <group ref={group} dispose={null}>
      <group ref={meshGroup}>
        <primitive 
          object={scene} 
          scale={scale} 
          {...props} 
        />
        <DustParticles count={300} />
      </group>
    </group>
  );
}

const Loader = () => (
  <Html center>
    <div className="text-indigo-400 font-mono text-[10px] whitespace-nowrap animate-pulse">
      INITIATING FLIGHT...
    </div>
  </Html>
);

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full pointer-events-auto">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: isMobile ? 60 : 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        
        <Suspense fallback={<Loader />}>
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Model scale={isMobile ? 0.004 : 0.007} />
            </Float>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;