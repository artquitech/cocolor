import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Simplified weapon component
const Weapon: React.FC<{ 
  position: [number, number, number]; 
  weaponType: string;
  delay: number;
}> = ({ position, weaponType, delay }) => {
  const [visible, setVisible] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    // Appear with delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  useFrame(({ clock }) => {
    if (meshRef.current && visible) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8 + position[0]) * 0.05;
      // Rotation
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  // Early return if not visible
  if (!visible) {
    return null;
  }
  
  let geometry;
  let color = '#333333';
  
  // Create different weapon geometries based on type
  switch (weaponType) {
    case 'pistol':
      geometry = (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </group>
      );
      break;
    case 'rifle':
      geometry = (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.1, 0.05]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[0.1, 0.15, 0.05]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </group>
      );
      break;
    case 'katana':
      geometry = (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.03, 0.01]} />
            <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </group>
      );
      break;
    default:
      geometry = (
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
  
  return (
    <group 
      ref={meshRef} 
      position={position} 
      scale={visible ? 1 : 0}
    >
      {geometry}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.1}
        color="#00ff00"
        anchorX="center"
        anchorY="top"
      >
        {weaponType.toUpperCase()}
      </Text>
    </group>
  );
};

// Weapons rack component
const WeaponsRack: React.FC = () => {
  const rackRef = useRef<THREE.Group>(null);
  
  const weapons = [
    { type: 'pistol', position: [-1.5, 1.2, 0], delay: 500 },
    { type: 'rifle', position: [0, 1.2, 0], delay: 800 },
    { type: 'katana', position: [1.5, 1.2, 0], delay: 1100 },
  ];
  
  return (
    <group ref={rackRef}>
      {/* Rack base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[5, 0.1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Column 1 */}
      <mesh position={[-2, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Column 2 */}
      <mesh position={[2, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Top bar */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Weapons */}
      {weapons.map((weapon, index) => (
        <Weapon 
          key={index}
          position={weapon.position}
          weaponType={weapon.type}
          delay={weapon.delay}
        />
      ))}
      
      {/* Title */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.2}
        color="#00ff00"
        anchorX="center"
        anchorY="bottom"
      >
        WEAPONS RACK
      </Text>
    </group>
  );
};

export default WeaponsRack;