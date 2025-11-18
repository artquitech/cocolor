import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import useAppStore from '../../store/useConstructStore';

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

const PlayerController: React.FC = () => {
  const { setPlayerPosition, player, zones, setLookingAtZone } = useAppStore();
  const { camera } = useThree();

  const keyState = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const velocity = useRef(new Vector3());
  const moveSpeed = 5; // units per second
  const proximityDistance = 3; // distance to detect zones

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      switch (key) {
        case 'w':
        case 'arrowup':
          keyState.current.forward = true;
          break;
        case 's':
        case 'arrowdown':
          keyState.current.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          keyState.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          keyState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      switch (key) {
        case 'w':
        case 'arrowup':
          keyState.current.forward = false;
          break;
        case 's':
        case 'arrowdown':
          keyState.current.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          keyState.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          keyState.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update player position every frame
  useFrame((state, delta) => {
    // Reset velocity
    velocity.current.set(0, 0, 0);

    // Calculate movement direction based on camera orientation
    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; // Keep movement on horizontal plane
    direction.normalize();

    const right = new Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // Apply movement based on key state
    if (keyState.current.forward) {
      velocity.current.add(direction.multiplyScalar(moveSpeed * delta));
    }
    if (keyState.current.backward) {
      velocity.current.add(direction.multiplyScalar(-moveSpeed * delta));
    }
    if (keyState.current.left) {
      velocity.current.add(right.multiplyScalar(moveSpeed * delta));
    }
    if (keyState.current.right) {
      velocity.current.add(right.multiplyScalar(-moveSpeed * delta));
    }

    // Update position if there's movement
    if (velocity.current.length() > 0) {
      const newPosition = {
        x: player.position.x + velocity.current.x,
        y: player.position.y, // Keep y constant
        z: player.position.z + velocity.current.z,
      };

      // Apply boundaries (optional - keep player within a certain area)
      const boundary = 20;
      newPosition.x = Math.max(-boundary, Math.min(boundary, newPosition.x));
      newPosition.z = Math.max(-boundary, Math.min(boundary, newPosition.z));

      setPlayerPosition(newPosition);

      // Update camera to follow player
      camera.position.set(
        newPosition.x,
        newPosition.y,
        newPosition.z
      );
    }

    // Check proximity to zones
    checkZoneProximity();
  });

  const checkZoneProximity = () => {
    let closestZone: string | null = null;
    let closestDistance = Infinity;

    zones.forEach((zone) => {
      const dx = player.position.x - zone.position.x;
      const dz = player.position.z - zone.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < proximityDistance && distance < closestDistance) {
        closestDistance = distance;
        closestZone = zone.id;
      }
    });

    // Update looking at zone if changed
    if (closestZone !== player.lookingAtZoneId) {
      setLookingAtZone(closestZone);
    }
  };

  return null; // This component doesn't render anything
};

export default PlayerController;
