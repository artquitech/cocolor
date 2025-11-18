import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Building component
const Building: React.FC<{ 
  position: [number, number, number]; 
  size: [number, number, number];
  delay: number;
}> = ({ position, size, delay }) => {
  const [visible, setVisible] = useState(false);
  const buildingRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    // Appear with delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <mesh 
      ref={buildingRef} 
      position={position} 
      scale={visible ? 1 : 0}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
};

// Street component
const Street: React.FC<{ 
  position: [number, number, number]; 
  rotation: [number, number, number];
  size: [number, number, number];
  delay: number;
}> = ({ position, rotation, size, delay }) => {
  const [visible, setVisible] = useState(false);
  const streetRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    // Appear with delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <mesh 
      ref={streetRef} 
      position={position} 
      rotation={rotation}
      scale={visible ? 1 : 0}
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
};

// Full city simulation component
const CitySimulation: React.FC = () => {
  const cityRef = useRef<THREE.Group>(null);
  
  // City layout - buildings
  const buildings = [
    { position: [-3, 1, -3], size: [1, 2, 1], delay: 500 },
    { position: [-3, 2, 0], size: [1, 4, 1], delay: 700 },
    { position: [-3, 1.5, 3], size: [1, 3, 1], delay: 900 },
    { position: [0, 2, -3], size: [1, 4, 1], delay: 1100 },
    { position: [0, 1, 3], size: [1, 2, 1], delay: 1300 },
    { position: [3, 3, -3], size: [1, 6, 1], delay: 1500 },
    { position: [3, 1.5, 0], size: [1, 3, 1], delay: 1700 },
    { position: [3, 2, 3], size: [1, 4, 1], delay: 1900 },
  ];
  
  // Streets
  const streets = [
    { position: [0, 0, 0], rotation: [0, 0, 0], size: [10, 0.1, 10], delay: 300 },
    { position: [0, 0, 0], rotation: [0, 0, 0], size: [1, 0.12, 10], delay: 400 },
    { position: [0, 0, 0], rotation: [0, Math.PI / 2, 0], size: [1, 0.12, 10], delay: 400 },
  ];
  
  // Animation
  useFrame(({ clock }) => {
    if (!cityRef.current) return;
    
    // Rotate entire city slowly
    cityRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });
  
  return (
    <group ref={cityRef} position={[0, 0, 0]}>
      {/* Ground */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 36]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building 
          key={index}
          position={building.position}
          size={building.size}
          delay={building.delay}
        />
      ))}
      
      {/* Streets */}
      {streets.map((street, index) => (
        <Street 
          key={index}
          position={street.position}
          rotation={street.rotation}
          size={street.size}
          delay={street.delay}
        />
      ))}
      
      {/* Title */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.3}
        color="#00ff00"
        anchorX="center"
        anchorY="bottom"
      >
        CITY SIMULATION
      </Text>
    </group>
  );
};

export default CitySimulation;