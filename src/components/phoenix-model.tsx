"use client";

import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Html, PresentationControls, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Component to handle the fading trail
function PhoenixTrail({ targetRef }: { targetRef: React.RefObject<THREE.Group> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const maxParticles = 150;
  const [particles] = useState(() => {
    const arr = [];
    for (let i = 0; i < maxParticles; i++) {
      arr.push({
        pos: new THREE.Vector3(0, 0, 0),
        alpha: 0,
        life: 0
      });
    }
    return arr;
  });

  const positions = useMemo(() => new Float32Array(maxParticles * 3), []);
  const opacities = useMemo(() => new Float32Array(maxParticles), []);

  useFrame((state, delta) => {
    if (!targetRef.current || !pointsRef.current) return;

    // Get current world position of the phoenix
    const currentPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(currentPos);

    // Update particles
    let oldestIdx = 0;
    let minLife = Infinity;

    for (let i = 0; i < maxParticles; i++) {
      particles[i].life -= delta;
      if (particles[i].life < 0) particles[i].life = 0;
      
      if (particles[i].life < minLife) {
        minLife = particles[i].life;
        oldestIdx = i;
      }

      // Update buffer arrays
      positions[i * 3] = particles[i].pos.x;
      positions[i * 3 + 1] = particles[i].pos.y;
      positions[i * 3 + 2] = particles[i].pos.z;
      opacities[i] = particles[i].life; // Use life as alpha (0 to 1)
    }

    // Spawn new particle at current position
    particles[oldestIdx].pos.copy(currentPos);
    particles[oldestIdx].life = 1.0; // 1 second life

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    // We use a custom shader or size attenuation to handle individual opacities if needed, 
    // but for simplicity we'll just update the positions and use a general material.
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.08}
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
        scrub: 0.5, // Faster response to scroll
      }
    });

    // Extended path to reach corners, faster durations
    tl.to(group.current.position, { x: 10, y: 3, z: -4, duration: 1.5 })
      .to(group.current.rotation, { y: Math.PI * 0.5, duration: 1.5 }, 0)
      .to(meshGroup.current?.scale || {}, { x: 0, y: 0, z: 0, duration: 0.3 }, ">")
      
      .set(group.current.position, { x: -10, y: -2, z: -2 })
      .to(meshGroup.current?.scale || {}, { x: 1, y: 1, z: 1, duration: 0.3 }, ">")
      
      .to(group.current.position, { x: 0, y: 0, z: 0, duration: 1.5 }, ">")
      .to(group.current.rotation, { y: Math.PI * 2, duration: 1.5 }, "<")
      
      .to(group.current.position, { x: 12, y: 4, z: -5, duration: 1.5 }, ">")
      .to(meshGroup.current?.scale || {}, { x: 0, y: 0, z: 0, duration: 0.3 }, ">");

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
    <div className="text-indigo-400 font-mono text-[10px] whitespace-nowrap animate-pulse">
      IGNITING TRAIL...
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
        camera={{ position: [0, 0, 10], fov: isMobile ? 60 : 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        
        <Suspense fallback={<Loader />}>
          <PresentationControls
            global
            config={{ mass: 1, tension: 500 }}
            snap={{ mass: 2, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
              <Model scale={isMobile ? 0.004 : 0.007} />
            </Float>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;