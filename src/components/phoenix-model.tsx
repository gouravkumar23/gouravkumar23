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
function PhoenixTrail({ targetRef }: { targetRef: React.RefObject<THREE.Group> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200; 
  
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
    const spawnRate = 3; 

    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 1.5; 
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (spawned < spawnRate) {
        particles[i].life = 1.0;
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 1.5
        ));
        particles[i].velocity.set(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
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
        scrub: 1,
      }
    });

    // Define a single "lap" from left to right
    const startPos = { x: -20, y: -6, z: -8 };
    const endPos = { x: 20, y: 6, z: 4 };
    const startRot = { y: Math.PI / 2, z: 0.2 }; // Facing right with a slight tilt

    // Lap 1
    tl.set(group.current.position, startPos)
      .set(group.current.rotation, startRot)
      .to(group.current.position, { ...endPos, duration: 10, ease: "none" })
      
      // Lap 2
      .set(group.current.position, startPos)
      .to(group.current.position, { ...endPos, duration: 10, ease: "none" })
      
      // Lap 3
      .set(group.current.position, startPos)
      .to(group.current.position, { ...endPos, duration: 10, ease: "none" });

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
      <PhoenixTrail targetRef={birdRef} />
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
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
            <Model scale={isMobile ? 0.005 : 0.008} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;