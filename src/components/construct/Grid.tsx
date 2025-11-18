import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Grid: React.FC = () => {
  const gridRef = useRef<THREE.Group>(null);
  
  // Animate grid
  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Subtle floating movement
      gridRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });
  
  return (
    <group ref={gridRef}>
      {/* Grid floor */}
      <gridHelper 
        args={[100, 100, 0x008800, 0x008800]} 
        position={[0, -0.01, 0]} 
        rotation={[0, 0, 0]}
      />
      
      {/* Secondary grid for layered effect */}
      <gridHelper 
        args={[100, 20, 0x00ff00, 0x00ff00]} 
        position={[0, 0, 0]} 
        rotation={[0, Math.PI / 4, 0]}
        visible={true}
      />
      
      {/* Infinite floor plane - slightly reflective */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.02, 0]} 
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.7} 
          metalness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export default Grid;