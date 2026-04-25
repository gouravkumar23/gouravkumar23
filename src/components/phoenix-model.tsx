"use client";

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Dynamic Trail Component
function PhoenixTrail({ targetRef }: { targetRef: React.RefObject<THREE.Group> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;
  
  // Particle state
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(0, -100, 0), // Start off-screen
        life: 0,
        size: 0
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    if (!targetRef.current || !pointsRef.current) return;

    const currentPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(currentPos);

    // Update particles
    let spawned = false;
    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta;
        // Add slight drift
        particles[i].pos.y += delta * 0.2;
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (!spawned) {
        // Spawn new particle at bird's position
        particles[i].life = 1.0; // 1 second life
        particles[i].pos.copy(currentPos);
        spawned = true;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </Points>
  );
}

function Model({ scale = 1, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const birdRef = useRef<THREE.Group>(null);
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

    tl.to(group.current.position, { x: 15, y: 5, z: -5, duration: 2 })
      .to(group.current.rotation, { y: Math.PI * 0.5, duration: 2 }, 0)
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 })
      
      .set(group.current.position, { x: -15, y: -3, z: -2 })
      .to(group.current.scale, { x: scale, y: scale, z: scale, duration: 0.5 })
      
      .to(group.current.position, { x: 0, y: 0, z: 0, duration: 2 })
      .to(group.current.rotation, { y: Math.PI * 2, duration: 2 }, "<")
      
      .to(group.current.position, { x: 18, y: 6, z: -8, duration: 2 })
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scale]);

  return (
    <group ref={group} dispose={null}>
      <group ref={birdRef}>
        <primitive object={scene} scale={scale} {...props} />
      </group>
      <PhoenixTrail targetRef={birdRef} />
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