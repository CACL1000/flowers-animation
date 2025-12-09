import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FallingPetalsProps {
  count?: number;
  color: string;
}

const Petal: React.FC<{ initialPos: [number, number, number]; color: string }> = ({ initialPos, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Random properties for each petal
  const speed = useMemo(() => 0.02 + Math.random() * 0.03, []);
  const rotationSpeed = useMemo(() => (Math.random() - 0.5) * 0.05, []);
  const swayOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Fall down
      meshRef.current.position.y -= speed;
      
      // Sway back and forth
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime + swayOffset) * 0.01;
      meshRef.current.position.z += Math.cos(state.clock.elapsedTime + swayOffset) * 0.01;
      
      // Rotate
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.z += rotationSpeed;

      // Reset if it goes too low
      if (meshRef.current.position.y < -4) {
        meshRef.current.position.y = 4 + Math.random() * 2;
        meshRef.current.position.x = (Math.random() - 0.5) * 6;
        meshRef.current.position.z = (Math.random() - 0.5) * 6;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={initialPos} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
      {/* A simple curved shape for a petal */}
      <dodecahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.8} 
        side={THREE.DoubleSide} 
        roughness={0.5}
      />
    </mesh>
  );
};

export const FallingPetals: React.FC<FallingPetalsProps> = ({ count = 40, color }) => {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      initialPos: [
        (Math.random() - 0.5) * 6, // x
        Math.random() * 6 - 2,     // y (spread vertically)
        (Math.random() - 0.5) * 6  // z
      ] as [number, number, number]
    }));
  }, [count]);

  return (
    <group>
      {petals.map((props, i) => (
        <Petal key={i} initialPos={props.initialPos} color={color} />
      ))}
    </group>
  );
};