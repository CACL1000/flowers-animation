import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Shared types
interface FlowerProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  rotation?: [number, number, number];
  isPlaying?: boolean;
}

// Reusable Stem Component
const Stem: React.FC<{ length?: number; curvature?: number }> = ({ length = 3, curvature = 0.3 }) => {
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      // Start strictly at 0,0,0 (t=0) to ensure connection with flower head
      // Curve smoothly outwards and downwards
      const x = Math.sin(t * Math.PI) * curvature; 
      const y = -t * length;
      const z = Math.sin(t * Math.PI * 0.5) * (curvature * 0.5);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [length, curvature]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.04, 8, false]} />
      <meshStandardMaterial color="#4a7c59" roughness={0.8} />
    </mesh>
  );
};

// --- CARNATION ---
export const Carnation: React.FC<FlowerProps> = ({ position, color, scale = 1, rotation = [0, 0, 0], isPlaying }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      
      // Interaction & Audio logic
      const pulse = isPlaying ? Math.sin(t * 10) * 0.05 : 0;
      const hoverScale = hovered ? 0.2 : 0; // Scale up on hover
      const hoverWobble = hovered ? Math.sin(t * 20) * 0.05 : 0; // Shake rapidly on hover

      const targetScale = scale + pulse + hoverScale;
      
      // Smoothly interpolate scale
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Sway
      groupRef.current.rotation.z = rotation[2] + Math.sin(t + timeOffset) * 0.05 + hoverWobble;
    }
  });

  const layers = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({
    scale: 1 - i * 0.15,
    y: i * 0.1,
    wobble: 0.8,
  })), []);

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation as any}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <Stem length={4} />
      <group position={[0, 0, 0]}>
        {layers.map((layer, i) => (
          <mesh key={i} position={[0, layer.y, 0]} rotation={[0, i, 0]}>
            <dodecahedronGeometry args={[0.5 * layer.scale, 0]} />
            <MeshWobbleMaterial 
              factor={hovered ? layer.wobble * 1.5 : layer.wobble} // More wobble on hover
              speed={hovered ? 5 : 2} 
              color={hovered ? new THREE.Color(color).offsetHSL(0, 0.1, 0.1) : color} 
              transparent 
              opacity={0.9} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        ))}
        {/* Calyx */}
        <mesh position={[0, -0.4, 0]}>
          <coneGeometry args={[0.2, 0.6, 6]} />
          <meshStandardMaterial color="#5a8c69" />
        </mesh>
      </group>
    </group>
  );
};

// --- ROSE ---
export const Rose: React.FC<FlowerProps> = ({ position, color, scale = 1, rotation = [0, 0, 0], isPlaying }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = isPlaying ? Math.sin(t * 12 + timeOffset) * 0.05 : 0;
      const hoverScale = hovered ? 0.3 : 0;
      
      const targetScale = scale + pulse + hoverScale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Rotate slightly towards viewer on hover (simplified)
      groupRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5 + timeOffset) * 0.03 + (hovered ? 0.2 : 0);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation as any}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <Stem length={3.5} />
      {/* Flower Head */}
      <group position={[0, 0.2, 0]}>
        {/* Core */}
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[0.25, 0.1, 64, 8, 2, 3]} />
          <meshStandardMaterial color={hovered ? new THREE.Color(color).offsetHSL(0, 0, 0.1) : color} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Outer Petals */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
           <torusGeometry args={[0.35, 0.1, 16, 32]} />
           <MeshWobbleMaterial factor={hovered ? 0.6 : 0.2} speed={hovered ? 3 : 1} color={color} />
        </mesh>
         {/* Calyx */}
         <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.05, 0.5, 5]} />
          <meshStandardMaterial color="#5a8c69" />
        </mesh>
      </group>
    </group>
  );
};

// --- TULIP ---
export const Tulip: React.FC<FlowerProps> = ({ position, color, scale = 1, rotation = [0, 0, 0], isPlaying }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = isPlaying ? Math.sin(t * 8 + timeOffset) * 0.08 : 0;
      const hoverScale = hovered ? 0.25 : 0;

      const targetScale = scale + pulse + hoverScale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Happy wobble
      groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.7 + timeOffset) * 0.04 + (hovered ? Math.sin(t * 15) * 0.1 : 0);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation as any}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <Stem length={4.5} curvature={0.2} />
      {/* Flower Head */}
      <group position={[0, 0.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={hovered ? new THREE.Color(color).offsetHSL(0, 0.1, 0.1) : color} side={THREE.DoubleSide} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};