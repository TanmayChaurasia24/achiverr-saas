
import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTheme } from '@/components/ThemeProvider';
import { OrbitControls, PresentationControls } from '@react-three/drei';

interface SceneWrapperProps {
  children: React.ReactNode;
  autoRotate?: boolean;
  enableZoom?: boolean;
  className?: string;
  presentationMode?: boolean;
}

export function SceneWrapper({ 
  children, 
  autoRotate = true, 
  enableZoom = false,
  className = "h-64 w-full",
  presentationMode = false
}: SceneWrapperProps) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className={`${className} rounded-lg overflow-hidden`}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <ambientLight intensity={theme === 'dark' ? 0.2 : 0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={theme === 'dark' ? 1.5 : 1} 
          castShadow 
          shadow-mapSize={1024} 
        />
        <pointLight position={[-10, 0, -10]} intensity={theme === 'dark' ? 0.5 : 0.2} />
        
        {presentationMode ? (
          <PresentationControls
            global
            zoom={1.2}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            {children}
          </PresentationControls>
        ) : (
          <>
            <OrbitControls 
              enableZoom={enableZoom} 
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              enablePan={false}
            />
            {children}
          </>
        )}
      </Canvas>
    </div>
  );
}
