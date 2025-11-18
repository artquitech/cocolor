import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Animation keyframe helper
interface Keyframe {
  time: number;
  rotation: [number, number, number];
  position: [number, number, number];
}

// Simplified figure to represent a human in training pose
const TrainingFigure: React.FC<{ 
  position: [number, number, number]; 
  delay: number;
  animationType: 'punch' | 'kick' | 'block';
}> = ({ position, delay, animationType }) => {
  const [visible, setVisible] = useState(false);
  const figureRef = useRef<THREE.Group>(null);
  const animationTime = useRef(0);
  
  // Define animation keyframes based on type
  const getKeyframes = (): Keyframe[] => {
    switch (animationType) {
      case 'punch':
        return [
          { time: 0, rotation: [0, 0, 0], position: [0, 0, 0] },
          { time: 0.5, rotation: [0, Math.PI / 4, 0], position: [0.3, 0, 0] },
          { time: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
        ];
      case 'kick':
        return [
          { time: 0, rotation: [0, 0, 0], position: [0, 0, 0] },
          { time: 0.5, rotation: [Math.PI / 6, 0, 0], position: [0, 0.2, 0.3] },
          { time: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
        ];
      case 'block':
        return [
          { time: 0, rotation: [0, 0, 0], position: [0, 0, 0] },
          { time: 0.5, rotation: [0, -Math.PI / 6, Math.PI / 6], position: [-0.2, 0.1, 0] },
          { time: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
        ];
      default:
        return [
          { time: 0, rotation: [0, 0, 0], position: [0, 0, 0] },
          { time: 1, rotation: [0, 0, 0], position: [0, 0, 0] },
        ];
    }
  };
  
  const keyframes = getKeyframes();
  
  useEffect(() => {
    // Appear with delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (!figureRef.current || !visible) return;
    
    // Updated animation time (looping between 0 and 1)
    animationTime.current = (clock.getElapsedTime() * 0.5) % 1;
    
    // Find the two keyframes to interpolate between
    let startKeyframe = keyframes[0];
    let endKeyframe = keyframes[keyframes.length - 1];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        animationTime.current >= keyframes[i].time && 
        animationTime.current <= keyframes[i + 1].time
      ) {
        startKeyframe = keyframes[i];
        endKeyframe = keyframes[i + 1];
        break;
      }
    }
    
    // Calculate interpolation factor
    const timeRange = endKeyframe.time - startKeyframe.time;
    const alpha = timeRange === 0 ? 0 : (animationTime.current - startKeyframe.time) / timeRange;
    
    // Apply interpolated rotation and position to limbs
    if (figureRef.current.children[1]) { // Arms
      const limbGroup = figureRef.current.children[1] as THREE.Object3D;
      
      // Interpolate rotation
      limbGroup.rotation.x = THREE.MathUtils.lerp(
        startKeyframe.rotation[0], endKeyframe.rotation[0], alpha
      );
      limbGroup.rotation.y = THREE.MathUtils.lerp(
        startKeyframe.rotation[1], endKeyframe.rotation[1], alpha
      );
      limbGroup.rotation.z = THREE.MathUtils.lerp(
        startKeyframe.rotation[2], endKeyframe.rotation[2], alpha
      );
      
      // Interpolate position
      limbGroup.position.x = THREE.MathUtils.lerp(
        startKeyframe.position[0], endKeyframe.position[0], alpha
      );
      limbGroup.position.y = THREE.MathUtils.lerp(
        startKeyframe.position[1], endKeyframe.position[1], alpha
      );
      limbGroup.position.z = THREE.MathUtils.lerp(
        startKeyframe.position[2], endKeyframe.position[2], alpha
      );
    }
  });
  
  // Early return if not visible
  if (!visible) {
    return null;
  }
  
  return (
    <group 
      ref={figureRef} 
      position={position}
      scale={visible ? 1 : 0}
    >
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.8, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Limbs group (the part that animates) */}
      <group position={[0, 0, 0]}>
        {/* Left Arm */}
        <mesh position={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Right Arm */}
        <mesh position={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Legs */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.2]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>
      
      {/* Head */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.1}
        color="#00ff00"
        anchorX="center"
        anchorY="top"
      >
        {animationType.toUpperCase()}
      </Text>
    </group>
  );
};

// Full training program component
const TrainingProgram: React.FC = () => {
  const programRef = useRef<THREE.Group>(null);
  
  const trainingFigures = [
    { type: 'punch', position: [-2, 0.7, 0], delay: 500 },
    { type: 'kick', position: [0, 0.7, 0], delay: 800 },
    { type: 'block', position: [2, 0.7, 0], delay: 1100 },
  ] as const;
  
  return (
    <group ref={programRef}>
      {/* Training mat */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 36]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Training figures */}
      {trainingFigures.map((figure, index) => (
        <TrainingFigure 
          key={index}
          position={figure.position}
          animationType={figure.type}
          delay={figure.delay}
        />
      ))}
      
      {/* Title */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#00ff00"
        anchorX="center"
        anchorY="bottom"
      >
        MARTIAL ARTS TRAINING
      </Text>
    </group>
  );
};

export default TrainingProgram;