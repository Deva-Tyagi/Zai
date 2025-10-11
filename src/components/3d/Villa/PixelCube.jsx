// src/components/3d/Villa/PixelCube.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function PixelCube() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    const s = 1 + Math.sin(t * 2) * 0.08;
    ref.current.scale.set(s, s, s);
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = Math.sin(t * 1.4) * 0.25;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#6A4C93" emissive="#6A4C93" emissiveIntensity={0.35} roughness={0.4} metalness={0.1}/>
    </mesh>
  );
}
