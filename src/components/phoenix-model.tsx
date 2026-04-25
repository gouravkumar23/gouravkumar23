"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Html, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Trail() {
  const points = useRef<THREE.Points>(null);
  const count = 100;
  const [positions, setPositions] = React.useState(() => new Float32Array(count * 3));
  
  // We'll use a simple trail that follows the mouse or a target
  // But since the phoenix is animated by GSAP, we'll just create some ambient floating dust
  // that moves slightly to give the illusion of a trail.
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.01;
      points.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  return (
    <Points positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

function Model({ scale = 1, ...props }: any) {
  const group = useRef<THREE.Group>(null);
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
          emissiveIntensity: 1.5,
        });
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && names.length > 0) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  useEffect(() => {
    if (!group.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    tl.to(group.current.position, { x: 12, y: 5, z: -5, duration: 2 })
      .to(group.current.rotation, { y: Math.PI * 0.5, duration: 2 }, 0)
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 })
      
      .set(group.current.position, { x: -12, y: -3, z: -2 })
      .to(group.current.scale, { 
        x: scale, 
        y: scale, 
        z: scale, 
        duration: 0.5 
      })
      
      .to(group.current.position, { x: 0, y: 0, z: 0, duration: 2 })
      .to(group.current.rotation, { y: Math.PI * 2, duration: 2 }, "<")
      
      .to(group.current.position, { x: 15, y: 6, z: -8, duration: 2 })
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scale]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={scale} {...props} />
      <Trail />
    </group>
  );
}

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: isMobile ? 60 : 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
            <Model scale={isMobile ? 0.004 : 0.007} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;