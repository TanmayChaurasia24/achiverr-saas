
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '@/components/ThemeProvider';
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
  const { theme = 'system' } = useTheme() || {};
  
  // Determine actual theme based on system preference if needed
  const actualTheme = theme === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
    : theme;

  // Animation logic
  useFrame((state, delta) => {
    if (!animated || !targetRef.current) return;
    targetRef.current.rotation.y += delta * 0.2;
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
    }
  });

  // Colors based on theme
  const targetColor = actualTheme === 'dark' ? '#4f6bff' : '#3b57e0';
  const ringColor = actualTheme === 'dark' ? '#6486ff' : '#5373eb';
  const progressColor = actualTheme === 'dark' ? '#64ffb4' : '#00e891';

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
        color={actualTheme === 'dark' ? 'white' : 'black'}
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
