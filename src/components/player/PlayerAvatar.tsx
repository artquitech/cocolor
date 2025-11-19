import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import useAppStore from '../../store/useConstructStore';

const PlayerAvatar: React.FC = () => {
  const { player } = useAppStore();
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);

  // Gentle bobbing animation when player is moving
  useFrame((state) => {
    if (bodyRef.current && headRef.current) {
      const bobAmount = Math.sin(state.clock.elapsedTime * 4) * 0.05;
      headRef.current.position.y = 0.8 + bobAmount;
    }
  });

  return (
    <group position={[player.position.x, player.position.y - 1.7, player.position.z]}>
      {/* Body - capsule style */}
      <mesh ref={bodyRef} position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wireframe overlay for tech look */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.32, 0.62, 8, 16]} />
        <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Shadow circle on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Indicator ring at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.35, 0.4, 32]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export default PlayerAvatar;
