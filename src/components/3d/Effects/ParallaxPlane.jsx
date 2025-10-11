// src/components/3d/Effects/ParallaxPlane.jsx
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export default function ParallaxPlane({
  colorUrl = '/textures/villa.jpg',
  depthUrl = '/textures/villa-depth.png',
  segments = 256,
  displacement = 0.5,
  z = -2.2,
  moveX = 0.32,
  moveY = 0.18,
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
    const px = mouse.current.x;
    const py = mouse.current.y;
    const targetX = px * moveX;
    const targetY = py * moveY;
    if (!group.current) return;
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
