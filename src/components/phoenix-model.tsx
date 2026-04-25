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
function PhoenixTrail({ targetRef, direction }: { targetRef: React.RefObject<THREE.Group>, direction: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500; 
  
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(0, -100, 0),
        life: 0,
        velocity: new THREE.Vector3(),
        size: Math.random() * 0.4 + 0.1,
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
    const spawnRate = 15; 

    for (let i = 0; i < count; i++) {
      if (particles[i].life > 0) {
        particles[i].life -= delta * 0.5; 
        particles[i].pos.add(particles[i].velocity.clone().multiplyScalar(delta));
        
        positions[i * 3] = particles[i].pos.x;
        positions[i * 3 + 1] = particles[i].pos.y;
        positions[i * 3 + 2] = particles[i].pos.z;
      } else if (spawned < spawnRate) {
        particles[i].life = 1.0;
        particles[i].pos.copy(currentPos).add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.2
        ));
        
        // Trail velocity is slightly randomized for a "sparkle" spread
        particles[i].velocity.set(
          (Math.random() - 0.5) * 2,
          0.5 + Math.random() * 0.5,
          (Math.random() - 0.5) * 2
        );
        spawned++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Twinkle effect
    if (pointsRef.current.material instanceof THREE.PointsMaterial) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.material.opacity = 0.3 + Math.sin(time * 8) * 0.2;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1" // Matches bird's indigo glow
        size={0.2}
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
          opacity: 0.3,
          emissive: "#6366f1",
          emissiveIntensity: 3,
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
        onUpdate: (self) => {
          scrollDir.current = self.direction;
        }
      }
    });

    // 1. Start: Middle
    tl.set(group.current.position, { x: 0, y: 0, z: 0 });
    tl.set(group.current.rotation, { y: Math.PI / 2 }); // Face Right

    // 2. Slant to Right Corner
    tl.to(group.current.position, { x: 25, y: 18, z: -10, duration: 5, ease: "power1.inOut" });
    
    // 3. Flip and fly to Left Corner at same Y
    tl.to(group.current.rotation, { y: -Math.PI / 2, duration: 0.5 });
    tl.to(group.current.position, { x: -25, y: 18, z: -10, duration: 5, ease: "none" });
    
    // 4. Flip and slant to Right Corner (Lower)
    tl.to(group.current.rotation, { y: Math.PI / 2, duration: 0.5 });
    tl.to(group.current.position, { x: 25, y: -18, z: -10, duration: 10, ease: "power1.inOut" });
    
    // 5. Flip and return to Middle at the end
    tl.to(group.current.rotation, { y: -Math.PI / 2, duration: 0.5 });
    tl.to(group.current.position, { x: 0, y: -38, z: 10, duration: 5, ease: "power2.out" });

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