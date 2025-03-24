
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '@/components/ThemeProvider';
import * as THREE from 'three';

interface TasksModelProps {
  completedTasks: number;
  totalTasks: number;
  size?: number;
}

export function TasksModel({ completedTasks, totalTasks, size = 1 }: TasksModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  const spacing = size * 0.8;
  const maxTasks = Math.min(totalTasks, 5); // Show max 5 tasks for visual clarity
  
  // Colors based on theme
  const completedColor = theme === 'dark' ? '#64ffb4' : '#00e891';
  const pendingColor = theme === 'dark' ? '#64748b' : '#cbd5e1';
  
  // Animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: maxTasks }).map((_, index) => {
        const isCompleted = index < completedTasks;
        const xPos = (index - (maxTasks - 1) / 2) * spacing;
        
        return (
          <group key={index} position={[xPos, 0, 0]}>
            {/* Task cube */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[size * 0.6, size * 0.6, size * 0.6]} />
              <meshStandardMaterial 
                color={isCompleted ? completedColor : pendingColor}
                metalness={isCompleted ? 0.7 : 0.2}
                roughness={isCompleted ? 0.2 : 0.8}
              />
            </mesh>
            
            {/* Show checkmark for completed tasks */}
            {isCompleted && (
              <mesh position={[0, 0, size * 0.31]} castShadow>
                <planeGeometry args={[size * 0.4, size * 0.4]} />
                <meshStandardMaterial 
                  color={theme === 'dark' ? '#1e293b' : 'white'}
                  emissive={theme === 'dark' ? '#1e293b' : 'white'}
                  emissiveIntensity={0.5}
                />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* Show indicator if there are more tasks than displayed */}
      {totalTasks > maxTasks && (
        <mesh position={[(maxTasks - 1) / 2 * spacing + spacing, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[size * 0.2, 16, 16]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#94a3b8' : '#64748b'}
          />
        </mesh>
      )}
    </group>
  );
}
