"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Points, PointMaterial } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";

gsap.registerPlugin(ScrollTrigger);

// Volumetric Trail Component
function PhoenixTrail({ targetRef, opacity }: { targetRef: React.RefObject<THREE.Group>, opacity: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 800; 
  
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
    const spawnRate = opacity > 0.1 ? 12 : 0; 

    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 0.8; 
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (spawned < spawnRate) {
        particles[i].life = 1.0;
        // Spawn slightly behind the bird
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          -4, // Offset behind (increased for larger bird)
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1
        ));
        
        particles[i].velocity.set(
          -3 - Math.random() * 3, // Move backwards
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1
        );
        spawned++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      pointsRef.current.material.opacity = 0.6 * opacity;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function Model({ scale = 0.02, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const birdRef = useRef<THREE.Group>(null);
  const { resolvedTheme } = useTheme();
  const [modelOpacity, setModelOpacity] = React.useState(1);
  const { scene, animations } = useGLTF("/3dmodels/phoenix_bird/scene.gltf");
  const { actions, names } = useAnimations(animations, group);

  const material = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    return new THREE.MeshStandardMaterial({
      color: isDark ? "#1e1b4b" : "#0f172a",
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      emissive: isDark ? "#6366f1" : "#1e293b",
      emissiveIntensity: isDark ? 8 : 2,
    });
  }, [resolvedTheme]);

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

    // 1. Spawn at Center Top
    tl.set(group.current.position, { x: 0, y: 5, z: 0 });
    tl.set(group.current.scale, { x: 1, y: 1, z: 1 });
    tl.set(group.current.rotation, { y: Math.PI / 2 }); // Face Right

    // 2. Pass 1: Gentle Glide to Right
    tl.to(group.current.position, { x: 30, y: -5, z: -5, duration: 10, ease: "none" });
    
    // 3. Loop 1: Vanish and Teleport to Top Left
    tl.to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
    tl.set(group.current.position, { x: -30, y: 5, z: -5 });
    tl.to(group.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });

    // 4. Pass 2: Gentle Glide to Right
    tl.to(group.current.position, { x: 30, y: -10, z: -5, duration: 10, ease: "none" });

    // 5. Loop 2: Vanish and Teleport to Top Left
    tl.to(group.current.scale, { x: 0, y: 0, z: 0, duration: 0.5 });
    tl.set(group.current.position, { x: -30, y: 5, z: -5 });
    tl.to(group.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });

    // 6. Pass 3: Final Glide to Center (Contact Section)
    tl.to(group.current.position, { x: 0, y: -4, z: 5, duration: 10, ease: "power1.inOut" });

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
        camera={{ position: [0, 0, 25], fov: isMobile ? 75 : 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={10} color="#6366f1" />
        <Suspense fallback={null}>
          <Float speed={3} rotationIntensity={0.3} floatIntensity={0.3}>
            <Model scale={isMobile ? 0.015 : 0.02} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhoenixModel;