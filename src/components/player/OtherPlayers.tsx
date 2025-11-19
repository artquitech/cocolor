import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh } from 'three';
import useAppStore, { OtherPlayerData } from '../../store/useConstructStore';

interface OtherPlayerProps {
  player: OtherPlayerData;
}

const OtherPlayer: React.FC<OtherPlayerProps> = ({ player }) => {
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);

  // Gentle bobbing animation
  useFrame((state) => {
    if (bodyRef.current && headRef.current) {
      const bobAmount = Math.sin(state.clock.elapsedTime * 4 + player.id.length) * 0.05;
      headRef.current.position.y = 0.8 + bobAmount;
    }
  });

  // Choose color based on whether player is looking at a zone or in a lesson
  const getPlayerColor = () => {
    if (player.currentLesson) {
      return '#00ffff'; // Cyan - in a lesson
    } else if (player.lookingAtZoneId) {
      return '#ffff00'; // Yellow - near a zone
    } else {
      return '#ff00ff'; // Magenta - default other player color
    }
  };

  const color = getPlayerColor();

  return (
    <group position={[player.position.x, player.position.y - 1.7, player.position.z]}>
      {/* Body - capsule style */}
      <mesh ref={bodyRef} position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wireframe overlay for tech look */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.32, 0.62, 8, 16]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>

      {/* Shadow circle on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Indicator ring at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.35, 0.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>

      {/* Player name label above head */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {player.name}
      </Text>

      {/* Optional: Show current lesson/slide info */}
      {player.currentLesson && (
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.1}
          color="#888888"
          anchorX="center"
          anchorY="bottom"
        >
          Slide {(player.currentSlide || 0) + 1}
        </Text>
      )}

      {/* Optional: Small indicator when player is looking at a zone */}
      {player.lookingAtZoneId && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      )}
    </group>
  );
};

const OtherPlayers: React.FC = () => {
  const { multiplayer } = useAppStore();

  // Convert Map to array for rendering
  const otherPlayersArray = Array.from(multiplayer.otherPlayers.values());

  if (otherPlayersArray.length === 0) {
    return null;
  }

  return (
    <>
      {otherPlayersArray.map((player) => (
        <OtherPlayer key={player.id} player={player} />
      ))}
    </>
  );
};

export default OtherPlayers;
