// src/components/3d/Environment/KoiFish.jsx
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function KoiFish({ count=24, area=[5.5, 2.2], y=-0.25, color='#FFC07A' }) {
  const geom = useMemo(() => new THREE.CapsuleGeometry(0.06, 0.12, 1, 8), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.0 }), [color]);
  const mesh = useRef();
  const seeds = useMemo(() => Array.from({length:count}, () => ({
    a: Math.random()*Math.PI*2,
    s: 0.4 + Math.random()*0.6,
    r: 0.6 + Math.random()*0.9
  })), [count]);
  const m4 = useMemo(() => new THREE.Matrix4(), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    for (let i=0;i<count;i++){
      const { a, s, r } = seeds[i];
      const px = Math.cos(t*s + a) * (area[0]*0.4 + r);
      const pz = Math.sin(t*s + a) * (area[1]*0.4 + r*0.3);
      const ry = Math.atan2(Math.cos(t*s + a)*-(area[1]*0.4 + r*0.3), Math.sin(t*s + a)*(area[0]*0.4 + r));
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0));
      const s3 = new THREE.Vector3(1, 1, 1);
      m4.compose(new THREE.Vector3(px, y, pz), q, s3);
      mesh.current.setMatrixAt(i, m4);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geom, mat, count]} castShadow />;
}
