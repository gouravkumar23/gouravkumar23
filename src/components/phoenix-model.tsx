"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Volumetric Trail Component with "Star" effect matching bird color
function PhoenixTrail({ targetRef, opacity }: { targetRef: React.RefObject<THREE.Group>, opacity: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 600; 
  
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(0, -100, 0),
        life: 0,
        velocity: new THREE.Vector3(),
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
    const spawnRate = opacity > 0.1 ? 8 : 0; 

    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 1.2; 
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (spawned < spawnRate) {
        particles[i].life = 1.0;
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ));
        
        particles[i].velocity.set(
          (Math.random() - 0.5) * 1.2,
          0.1 + Math.random() * 0.2,
          (Math.random() - 0.5) * 1.2
        );
        spawned++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.material.opacity = (0.15 + Math.sin(time * 15) * 0.1) * opacity;
    }
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

function Model({ scale = 0.001, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const birdRef = useRef<THREE.Group>(null);
  const [modelOpacity, setModelOpacity] = React.useState(1);
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const { actions, names } = useAnimations(animations, group);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: "#1e1b4b",
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      emissive: "#6366f1",
      emissiveIntensity: 5,
    });
    return mat;
  }, []);

  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = material;
      }
    });
  }, [scene, material]);

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
        onUpdate: (self) => {
          if (group.current) setModelOpacity(group.current.scale.x);
        }
      }
    });

    // 1. Spawn at Center
    tl.set(group.current.position, { x: 0, y: 0, z: 0 });
    tl.set(group.current.scale, { x: 1, y: 1, z: 1 });
    tl.set(group.current.rotation, { y: Math.PI / 2 }); // Face Right

    // 2. Pass 1: Gentle Downward Slant to Right
    tl.to(group.current.position, { x: 20, y: -12, z: -5, duration: 8, ease: "none" });
    
    // 3. Vanish at Right
    tl.to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
    tl.to(material, { opacity: 0, duration: 0.5 }, "<");

    // 4. Teleport to Left (at same Y)
    tl.set(group.current.position, { x: -20, y: -12, z: -5 });
    
    // 5. Reappear at Left
    tl.to(group.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
    tl.to(material, { opacity: 0.3, duration: 0.5 }, "<");

    // 6. Pass 2: Gentle Downward Slant to Right
    tl.to(group.current.position, { x: 20, y: -28, z: -5, duration: 10, ease: "none" });

    // 7. Final: Glide to Center and stay stationary (Contact Section)
    tl.to(group.current.position, { x: 0, y: -45, z: 5, duration: 5, ease: "power2.out" });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [material]);

  return (
    <>
      <group ref={group} dispose={null}>
        <group ref={birdRef}>
          <primitive object={scene} scale={scale} {...props} />
        </group>
      </group>
      <PhoenixTrail targetRef={birdRef} opacity={modelOpacity} />
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
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={10} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
            <Model scale={isMobile ? 0.095 : 0.0095} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;