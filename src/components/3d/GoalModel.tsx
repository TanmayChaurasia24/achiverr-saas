
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface GoalModelProps {
  progress?: number;
  size?: number;
  animated?: boolean;
}

export function GoalModel({ progress = 0, size = 1, animated = true }: GoalModelProps) {
  const targetRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Animation logic
  useFrame((state, delta) => {
    if (!animated || !targetRef.current) return;
    targetRef.current.rotation.y += delta * 0.2;
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
    }
  });

  // Dark theme colors
  const targetColor = '#4f6bff';
  const ringColor = '#6486ff';
  const progressColor = '#64ffb4';

  return (
    <group ref={targetRef}>
      {/* Center target */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={targetColor} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Progress ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.3 * size, 0.08 * size, 16, 100]} />
        <meshStandardMaterial
          color={ringColor}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Progress indicator */}
      {progress > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry
            args={[
              1.3 * size,
              0.12 * size,
              16,
              Math.max(1, Math.floor(100 * (progress / 100))), // Ensure segments >= 1
              Math.PI * 2 * (progress / 100),
            ]}
          />
          <meshStandardMaterial
            color={progressColor}
            metalness={0.8}
            roughness={0.2}
            emissive={progressColor}
            emissiveIntensity={0.4}
          />
        </mesh>
      )}

      {/* Progress text */}
      <Text
        position={[0, 0, size * 1.1]}
        color="white"
        fontSize={size * 0.5}
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {`${Math.round(progress)}%`}
      </Text>
    </group>
  );
}
