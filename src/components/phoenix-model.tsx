"use client";

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Html, PresentationControls, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Enhanced Dust Trail Component
function PhoenixTrail({ targetRef }: { targetRef: React.RefObject<THREE.Group> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;
  
  // Create a pool of particles
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(),
        life: 0,
        velocity: new THREE.Vector3()
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const sizes = useMemo(() => new Float32Array(count), [count]);

  useFrame((state, delta) => {
    if (!targetRef.current || !pointsRef.current) return;

    const currentPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(currentPos);

    // Update existing particles
    let spawned = false;
    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta;
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
        sizes[i] = particles[i].life * 0.15; // Size fades with life
      } else if (!spawned) {
        // Spawn a new particle at the current position with some randomness
        particles[i].life = 1.0; // 1 second life
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ));
        particles[i].velocity.set(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        );
        spawned = true;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff6400"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
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
          emissive: "#ff6400",
          emissiveIntensity: 1.2,
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
        scrub: 0.3, // Very fast response
      }
    });

    // Faster, wider path to reach corners
    tl.to(group.current.position, { x: 12, y: 4, z: -5, duration: 1 })
      .to(group.current.rotation, { y: Math.PI * 0.5, duration: 1 }, 0)
      .to(meshGroup.current?.scale || {}, { x: 0, y: 0, z: 0, duration: 0.2 }, ">")
      
      .set(group.current.position, { x: -12, y: -3, z: -2 })
      .to(meshGroup.current?.scale || {}, { x: 1, y: 1, z: 1, duration: 0.2 }, ">")
      
      .to(group.current.position, { x: 0, y: 0, z: 0, duration: 1 }, ">")
      .to(group.current.rotation, { y: Math.PI * 2, duration: 1 }, "<")
      
      .to(group.current.position, { x: 15, y: 5, z: -6, duration: 1 }, ">")
      .to(meshGroup.current?.scale || {}, { x: 0, y: 0, z: 0, duration: 0.2 }, ">");

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
      </group>
      <PhoenixTrail targetRef={meshGroup} />
    </group>
  );
}

const Loader = () => (
  <Html center>
    <div className="text-brand font-mono text-[10px] whitespace-nowrap animate-pulse">
      IGNITING COSMIC DUST...
    </div>
  </Html>
);

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: isMobile ? 60 : 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }} // Ensure it never blocks clicks
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff6400" />
        
        <Suspense fallback={<Loader />}>
          {/* Interaction is disabled to prioritize the keyboard, but the model still floats */}
          <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
            <Model scale={isMobile ? 0.004 : 0.007} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;