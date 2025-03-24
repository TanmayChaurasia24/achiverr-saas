
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '@/components/ThemeProvider';
import * as THREE from 'three';

interface RoadmapModelProps {
  steps: number;
  currentStep?: number;
  size?: number;
}

export function RoadmapModel({ steps, currentStep = 0, size = 1 }: RoadmapModelProps) {
  const pathRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  // Animation
  useFrame((state, delta) => {
    if (pathRef.current) {
      pathRef.current.rotation.y += delta * 0.2;
    }
  });
  
  // Colors based on theme
  const completedColor = theme === 'dark' ? '#64ffb4' : '#00e891';
  const currentColor = theme === 'dark' ? '#4f6bff' : '#3b57e0';
  const pendingColor = theme === 'dark' ? '#64748b' : '#cbd5e1';
  
  const maxVisibleSteps = Math.min(steps, 7);
  const spacing = size * 1.2;
  
  return (
    <group ref={pathRef}>
      {/* Create the path */}
      <mesh position={[0, -size * 0.3, 0]} receiveShadow>
        <boxGeometry args={[(maxVisibleSteps - 1) * spacing, size * 0.1, size * 0.5]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
          roughness={0.8}
        />
      </mesh>
      
      {/* Create the milestone markers */}
      {Array.from({ length: maxVisibleSteps }).map((_, index) => {
        const xPos = (index - (maxVisibleSteps - 1) / 2) * spacing;
        let markerColor;
        
        if (index < currentStep) {
          markerColor = completedColor;
        } else if (index === currentStep) {
          markerColor = currentColor;
        } else {
          markerColor = pendingColor;
        }
        
        return (
          <group key={index} position={[xPos, 0, 0]}>
            {/* Milestone marker */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[size * 0.3, size * 0.3, size * 0.7, 32]} />
              <meshStandardMaterial 
                color={markerColor}
                metalness={index <= currentStep ? 0.7 : 0.2}
                roughness={index <= currentStep ? 0.2 : 0.8}
              />
            </mesh>
            
            {/* Connection to ground */}
            <mesh position={[0, -size * 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[size * 0.1, size * 0.1, size * 0.5, 16]} />
              <meshStandardMaterial 
                color={markerColor}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Show indicator if there are more steps than displayed */}
      {steps > maxVisibleSteps && (
        <mesh position={[(maxVisibleSteps - 1) / 2 * spacing + spacing/2, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[size * 0.2, 16, 16]} />
          <meshStandardMaterial 
            color={theme === 'dark' ? '#94a3b8' : '#64748b'}
          />
        </mesh>
      )}
    </group>
  );
}
