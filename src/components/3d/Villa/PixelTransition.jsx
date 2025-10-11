// src/components/3d/Villa/PixelTransition.jsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function PixelTransition({ progressRef, count = 240 }) {
  const meshRef = useRef();
  const sp = useRef(0); // smoothed internal progress

  const seeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).normalize();
      const dist = 3 + Math.random() * 3;
      const rot = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const seed = Math.random() * Math.PI * 2;
      arr.push({ dir, dist, rot, seed });
    }
    return arr;
  }, [count]);

  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const scl = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const raw = progressRef.current.value || 0;

    // Smoothstep easing for a gentle break-up curve
    const smooth = Math.min(1, Math.max(0, raw));
    const ease = (3 * smooth * smooth) - (2 * smooth * smooth * smooth); // 3x^2 - 2x^3

    // Low-pass filter for additional inertia
    sp.current += (ease - sp.current) * 0.08;

    const t = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const { dir, dist, rot, seed } = seeds[i];

      // Outward motion
      pos.copy(dir).multiplyScalar(dist * sp.current);

      // Add floating near the end
      const floatAmt = 0.14 * Math.min(1, Math.max(0, sp.current - 0.85) / 0.15);
      if (floatAmt > 0) {
        pos.x += Math.sin(t * 0.6 + seed) * floatAmt * 0.35;
        pos.y += Math.cos(t * 0.7 + seed * 1.3) * floatAmt * 0.45;
        pos.z += Math.sin(t * 0.5 + seed * 0.7) * floatAmt * 0.30;
      }

      const s = 0.26 * (1 - 0.28 * sp.current);
      scl.set(s, s, s);

      const rx = rot.x * sp.current + floatAmt * 0.3 * Math.sin(t * 0.4 + seed);
      const ry = rot.y * sp.current + floatAmt * 0.35 * Math.cos(t * 0.45 + seed * 0.6);
      const rz = rot.z * sp.current + floatAmt * 0.25 * Math.sin(t * 0.38 + seed * 1.2);
      quat.setFromEuler(new THREE.Euler(rx, ry, rz));

      m4.compose(pos, quat, scl);
      meshRef.current.setMatrixAt(i, m4);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={'#6A4C93'}
        emissive={'#6A4C93'}
        emissiveIntensity={1.4}
        roughness={0.6}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
