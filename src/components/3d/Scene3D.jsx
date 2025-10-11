// src/components/3d/Scene3D.jsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Scene3D({ children }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: false }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <Suspense fallback={null}>
        {children}
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Suspense>
    </Canvas>
  );
}
