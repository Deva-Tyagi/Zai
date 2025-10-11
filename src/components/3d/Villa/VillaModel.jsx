// src/components/3d/Villa/VillaModel.jsx
import * as THREE from 'three';
import { useMemo, forwardRef } from 'react';

// Renders geometry twice: a fill mesh + a back-faced, slightly scaled clone for a clean outline
// Inverted-hull outline is cheap and avoids postprocessing; thickness is controlled by scaleMult. [1][2]
const OutlinedMesh = forwardRef(function OutlinedMesh(
  {
    geometry,
    color = '#2D1B3D',
    outline = '#000000',
    scaleMult = 1.02,
    opacity = 1,
    emissive = '#000000',
    emissiveIntensity = 0,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  },
  ref
) {
  const outlineMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      color: outline,
      side: THREE.BackSide, // back faces for inverted hull
      transparent: true,
      opacity,
      depthWrite: false,
    });
    m.toneMapped = false; // keep pure outline color
    return m;
  }, [outline, opacity]);

  const fillMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity,
      emissive,
      emissiveIntensity,
    });
  }, [color, opacity, emissive, emissiveIntensity]);

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh geometry={geometry} material={fillMat} />
      <mesh
        geometry={geometry}
        material={outlineMat}
        scale={[scaleMult, scaleMult, scaleMult]}
      />
    </group>
  );
});

// A lightweight blockout: base volume + wing + door + arch accents; swap/extend parts as needed. [1]
export default function VillaModel({ opacity = 1 }) {
  // Geometries are memoized to avoid reallocation every render. [1]
  const base = useMemo(() => new THREE.BoxGeometry(3.6, 2.2, 0.4), []);
  const wing = useMemo(() => new THREE.BoxGeometry(2.0, 1.6, 0.4), []);
  const door = useMemo(() => new THREE.BoxGeometry(0.7, 1.2, 0.22), []);
  // Torus used as a simple half‑arch by rotating π and using thin radius. [1]
  const arch = useMemo(() => new THREE.TorusGeometry(0.55, 0.08, 12, 48, Math.PI), []);
  const windowSmall = useMemo(() => new THREE.BoxGeometry(0.5, 0.6, 0.18), []);
  const cap = useMemo(() => new THREE.BoxGeometry(3.8, 0.15, 0.5), []);

  return (
    <group>
      {/* Main block */}
      <OutlinedMesh
        geometry={base}
        opacity={opacity}
        position={[0.3, 0.15, 0]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
      {/* Roof cap for silhouette emphasis */}
      <OutlinedMesh
        geometry={cap}
        opacity={opacity}
        position={[0.3, 1.3, 0.02]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
      {/* Side wing */}
      <OutlinedMesh
        geometry={wing}
        opacity={opacity}
        position={[-1.7, 0.1, 0]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
      {/* Door and arch on main block */}
      <OutlinedMesh
        geometry={door}
        opacity={opacity}
        position={[0.4, -0.35, 0.22]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
      <OutlinedMesh
        geometry={arch}
        opacity={opacity}
        position={[0.4, 0.4, 0.22]}
        rotation={[Math.PI, 0, 0]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
      {/* Window + arch on wing */}
      <OutlinedMesh
        geometry={windowSmall}
        opacity={opacity}
        position={[-0.9, 0.1, 0.22]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
      <OutlinedMesh
        geometry={arch}
        opacity={opacity}
        position={[-0.9, 0.55, 0.22]}
        rotation={[Math.PI, 0, 0]}
        color="#2D1B3D"
        outline="#000000"
        scaleMult={1.02}
      />
    </group>
  );
}
