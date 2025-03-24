
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
  const { theme } = useTheme();
  
  // Animation logic
  useFrame((state, delta) => {
    if (!animated || !targetRef.current) return;
    
    targetRef.current.rotation.y += delta * 0.2;
    
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
    }
  });
  
  // Calculate the ring progress arc
  const ringGeometry = new THREE.TorusGeometry(1.3 * size, 0.08 * size, 16, 100);
  
  // Colors based on theme
  const targetColor = theme === 'dark' ? '#4f6bff' : '#3b57e0';
  const ringColor = theme === 'dark' ? '#6486ff' : '#5373eb';
  const progressColor = theme === 'dark' ? '#64ffb4' : '#00e891';
  
  return (
    <group ref={targetRef}>
      {/* Center target */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={targetColor} 
          metalness={0.5} 
          roughness={0.2}
        />
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
          <torusBufferGeometry 
            args={[
              1.3 * size, // radius
              0.12 * size, // tube
              16, // radialSegments
              Math.floor(100 * (progress / 100)), // tubularSegments
              Math.PI * 2 * (progress / 100) // arc
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
        color={theme === 'dark' ? 'white' : 'black'}
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
