import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import { Carnation, Rose, Tulip } from './Carnation';
import { FallingPetals } from './FallingPetals';
import * as THREE from 'three';

interface FlowerSceneProps {
  color: string;
  isPlaying: boolean;
}

const Bouquet: React.FC<{ color: string; isPlaying: boolean }> = ({ color, isPlaying }) => {
  // Generate random flowers for the bouquet
  const flowers = useMemo(() => {
    const items = [];
    const count = 18; // Kept at 18 as requested
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      
      const theta = phi * i; // Golden angle increment
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Only use the top hemisphere for the bouquet shape
      if (y < -0.2) continue;

      // Adjusted positioning to look good without the cone
      const pos: [number, number, number] = [x * 1.2, y * 1.2 + 0.5, z * 1.2];
      
      // Calculate rotation to face outward from center
      const lookAt = new THREE.Vector3(pos[0], pos[1], pos[2]).normalize();
      const rotX = Math.atan2(lookAt.y, Math.sqrt(lookAt.x**2 + lookAt.z**2)) - Math.PI / 2;
      const rotY = Math.atan2(-lookAt.x, -lookAt.z); // Adjust orientation
      
      const rotation: [number, number, number] = [-rotX * 0.7, rotY, 0]; // Less tilt since stems are exposed

      // Randomize flower type
      const type = Math.random();
      const scale = 0.8 + Math.random() * 0.4;
      
      // Vary colors slightly based on the base color
      const baseCol = new THREE.Color(color);
      const hsl = { h: 0, s: 0, l: 0 };
      baseCol.getHSL(hsl);
      // Randomize lightness and hue slightly
      const fColor = new THREE.Color().setHSL(
        hsl.h + (Math.random() * 0.1 - 0.05),
        0.8,
        0.5 + Math.random() * 0.3
      ).getStyle();

      items.push({ pos, rotation, type, scale, color: fColor });
    }
    return items;
  }, [color]);

  return (
    <group position={[0, -1, 0]}>
      {/* Ribbon tying the stems directly (Adjusted position since cone is gone) */}
      <mesh position={[0, -1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.08, 16, 32]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>

      {/* Flowers */}
      {flowers.map((f, i) => (
        <React.Fragment key={i}>
          {f.type < 0.33 ? (
            <Carnation position={f.pos} rotation={f.rotation} scale={f.scale} color={f.color} isPlaying={isPlaying} />
          ) : f.type < 0.66 ? (
            <Rose position={f.pos} rotation={f.rotation} scale={f.scale} color={f.color} isPlaying={isPlaying} />
          ) : (
            <Tulip position={f.pos} rotation={f.rotation} scale={f.scale} color={f.color} isPlaying={isPlaying} />
          )}
        </React.Fragment>
      ))}

      {/* Extra floating particles/petals */}
      <Sparkles count={50} scale={4} size={4} speed={0.4} opacity={0.5} color="#fff" position={[0, 1, 0]} />
      
      {/* Falling Petals Component */}
      <FallingPetals color={color} count={40} />
    </group>
  );
};

export const FlowerScene: React.FC<FlowerSceneProps> = ({ color, isPlaying }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={0.5} intensity={1.5} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffcccc" />
          
          <Environment preset="city" />
          
          <Bouquet color={color} isPlaying={isPlaying} />

          <ContactShadows 
            opacity={0.3} 
            scale={10} 
            blur={2.5} 
            far={4} 
            color="#000000" 
            position={[0, -3.5, 0]}
          />

          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.8}
            minDistance={4}
            maxDistance={12}
            autoRotate={true}
            autoRotateSpeed={isPlaying ? 1.5 : 0.5} 
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};