// src/components/3d/Views/Panorama360.jsx
import { useRef } from 'react';
import { useTexture, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Panorama360({ src = '/textures/villa-panorama.png', rotate = 0 }) {
  const tex = useTexture(src);
  const group = useRef();

  // Optional gentle auto‑drift
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = rotate || state.clock.elapsedTime * 0.02;
  });

  return (
    <>
      <group ref={group}>
        <mesh rotation={[0, Math.PI, 0]}>
          <sphereGeometry args={[500, 64, 64]} />
          <meshBasicMaterial map={tex} side={THREE.BackSide} />
        </mesh>
      </group>
      <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.06} />
    </>
  );
}
