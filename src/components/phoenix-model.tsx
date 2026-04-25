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
  const count = 300; 
  
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
    const spawnRate = 4; 

    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 1.2; 
        // Particles drift slightly
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (spawned < spawnRate) {
        particles[i].life = 1.0;
        // Spawn at bird's world position with random offset
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 1.2
        ));
        particles[i].velocity.set(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
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
        size={0.07}
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
          opacity: 0.5,
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
        scrub: 0.5,
      }
    });

    // Flight Path 1: Across to the right
    tl.to(group.current.position, { x: 15, y: 4, z: -2, duration: 2, ease: "power1.inOut" })
      .to(group.current.rotation, { y: Math.PI * 0.4, duration: 2 }, 0)
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.3 })
      
      // Reset: Reappear from the left
      .set(group.current.position, { x: -15, y: -2, z: 2 })
      .to(group.current.scale, { x: scale, y: scale, z: scale, duration: 0.3 })
      
      // Flight Path 2: Swoop through center
      .to(group.current.position, { x: 0, y: 1, z: 3, duration: 2, ease: "power1.inOut" })
      .to(group.current.rotation, { y: Math.PI * 2.2, duration: 2 }, "<")
      
      // Exit: To the right again
      .to(group.current.position, { x: 18, y: 5, z: -2, duration: 2, ease: "power1.in" })
      .to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.3 });

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
      {/* Trail is outside the animated group to stay in world space */}
      <PhoenixTrail targetRef={birdRef} />
    </>
  );
}

const PhoenixModel = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: isMobile ? 65 : 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={4} rotationIntensity={0.8} floatIntensity={0.8}>
            <Model scale={isMobile ? 0.004 : 0.007} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;