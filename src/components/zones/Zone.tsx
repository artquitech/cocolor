import React, { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Text, Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ZoneDefinition } from '../../store/useConstructStore';

interface ZoneProps {
  zone: ZoneDefinition;
  isPlayerNearby: boolean;
  onActivate?: () => void;
}

const Zone: React.FC<ZoneProps> = ({ zone, isPlayerNearby, onActivate }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle floating animation + pulsing when nearby
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = zone.position.y + Math.sin(state.clock.elapsedTime) * 0.1;

      // Pulse effect when player is nearby
      if (isPlayerNearby) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 1;
        meshRef.current.scale.set(pulse, pulse, pulse);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  // Get color based on zone type
  const getZoneColor = () => {
    switch (zone.type) {
      case 'lesson':
        return '#00ff00'; // Green
      case 'video':
        return '#00ffff'; // Cyan
      case 'image':
        return '#ffff00'; // Yellow
      case 'exercise':
        return '#ff00ff'; // Magenta
      default:
        return '#ffffff';
    }
  };

  const color = getZoneColor();
  const isHighlighted = isPlayerNearby || hovered;

  return (
    <group position={[zone.position.x, zone.position.y, zone.position.z]}>
      {/* Main zone pod - pillar/totem style */}
      <Box
        ref={meshRef}
        args={[1, 2, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onActivate}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 0.5 : 0.2}
          transparent
          opacity={isHighlighted ? 0.9 : 0.7}
          wireframe={false}
        />
      </Box>

      {/* Wireframe overlay for tech look */}
      <Box args={[1.05, 2.05, 1.05]}>
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={isHighlighted ? 0.8 : 0.4}
        />
      </Box>

      {/* Floating ring indicator when nearby */}
      {isPlayerNearby && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Zone title label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {zone.title}
      </Text>

      {/* Zone type indicator */}
      <Text
        position={[0, 1.7, 0]}
        fontSize={0.12}
        color="#888888"
        anchorX="center"
        anchorY="bottom"
      >
        [{zone.type.toUpperCase()}]
      </Text>

      {/* Interaction hint when nearby */}
      {isPlayerNearby && (
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.15}
          color="#00ff00"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          Press E or use 'open zone {zone.id}'
        </Text>
      )}
    </group>
  );
};

export default Zone;
