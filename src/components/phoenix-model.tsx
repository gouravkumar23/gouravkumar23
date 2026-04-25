"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Volumetric Trail Component
function PhoenixTrail({ targetRef, direction }: { targetRef: React.RefObject<THREE.Group>, direction: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000; 
  
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(0, -100, 0),
        life: 0,
        velocity: new THREE.Vector3()
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    if (!targetRef.current || !pointsRef.current) return;

    const currentPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(currentPos);

    let spawned = 0;
    const spawnRate = 12; 

    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 0.4; 
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (spawned < spawnRate) {
        particles[i].life = 1.0;
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 1.0,
          (Math.random() - 0.5) * 2.0
        ));
        
        // Trail direction depends on flight direction
        const xVel = direction >= 0 ? 1.5 : -1.5;
        particles[i].velocity.set(
          xVel + (Math.random() - 0.5),
          0.5 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.5
        );
        spawned++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.6}
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
  const birdRef = useRef<THREE.Group>(null);
  const scrollDir = useRef(1);
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
          opacity: 0.4,
          emissive: "#6366f1",
          emissiveIntensity: 2,
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
        scrub: 0.3,
        onUpdate: (self) => {
          scrollDir.current = self.direction;
          if (!group.current) return;
          
          // Adjust rotation based on scroll direction
          // If scrolling down (direction 1), fly right-to-left (face left: -PI/2)
          // If scrolling up (direction -1), fly left-to-right (face right: PI/2)
          const targetY = self.direction >= 0 ? -Math.PI / 2 : Math.PI / 2;
          gsap.to(group.current.rotation, {
            y: targetY,
            duration: 0.3,
            overwrite: "auto"
          });
        }
      }
    });

    // Initial Hero State (Center)
    tl.set(group.current.position, { x: 0, y: 0, z: 0 });

    // Move to Start of Path (Top-Right)
    tl.to(group.current.position, { x: 25, y: 15, z: -10, duration: 2 });

    // Lap 1: Fly to Left-Middle
    tl.to(group.current.position, { x: -25, y: 5, z: -10, duration: 10, ease: "none" });
    
    // Teleport: Back to Right at same height
    tl.set(group.current.position, { x: 25, y: 5, z: -10 });
    
    // Lap 2: Fly to Left-Bottom
    tl.to(group.current.position, { x: -25, y: -15, z: -10, duration: 10, ease: "none" });
    
    // Final: Fly to front
    tl.to(group.current.position, { x: 0, y: -10, z: 15, duration: 5, ease: "power2.inOut" });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scale]);

  return (
    <>
      <group ref={group} dispose={null}>
        <group ref={birdRef}>
          <primitive object={scene} scale={scale} {...props} />
        </group>
      </group>
      <PhoenixTrail targetRef={birdRef} direction={scrollDir.current} />
    </>
  );
}

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: isMobile ? 70 : 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={5} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={3} rotationIntensity={0.4} floatIntensity={0.4}>
            <Model scale={isMobile ? 0.015 : 0.03} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;