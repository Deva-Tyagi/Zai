// src/components/3d/Effects/DepthImage.jsx
import { useMemo, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function DepthImage({
  colorUrl,
  depthUrl,
  z = -2.0,
  segments = 256,
  displacement = 0.45,
  moveX = 0.22,
  moveY = 0.14,
  damp = 0.10,
}) {
  const group = useRef();
  const [colorTex, depthTex] = useTexture([colorUrl, depthUrl]);
  const { camera, size } = useThree();

  const { wFull, hFull } = useMemo(() => {
    const d = Math.abs(camera.position.z - z);
    const f = (camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(f / 2) * d;
    const w = h * (size.width / size.height);
    return { wFull: w, hFull: h };
  }, [camera.position.z, camera.fov, size.width, size.height, z]);

  const [planeW, planeH] = useMemo(() => {
    const iw = colorTex?.image?.width ?? 1600;
    const ih = colorTex?.image?.height ?? 900;
    const a = iw / ih;
    const v = wFull / hFull;
    return a > v ? [hFull * a, hFull] : [wFull, wFull / a];
  }, [colorTex, wFull, hFull]);

  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.current.x = Math.max(-1, Math.min(1, x));
      mouse.current.y = Math.max(-1, Math.min(1, y));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const px = mouse.current.x;
    const py = mouse.current.y;
    const targetX = px * moveX;
    const targetY = py * moveY;
    group.current.position.x += (targetX - group.current.position.x) * damp;
    group.current.position.y += (targetY - group.current.position.y) * damp;
  });

  return (
    <group ref={group} position={[0, 0, z]}>
      <mesh>
        <planeGeometry args={[planeW, planeH, segments, segments]} />
        <meshStandardMaterial
          map={colorTex}
          displacementMap={depthTex}
          displacementScale={displacement}
          roughness={0.8}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
