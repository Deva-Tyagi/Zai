import * as THREE from 'three';

export default function Arch({ w=2.4, h=3.2, t=0.35, r=0.95, jamb=0.14, pos=[0,0,0], rot=[0,0,0] }) {
  // Outer profile
  const outer = new THREE.Shape();
  const hw = w*0.5, sh = h - r;
  outer.moveTo(-hw, 0);
  outer.lineTo(-hw, sh);
  outer.absarc(0, sh, r, Math.PI, 0, false);
  outer.lineTo(hw, 0);
  // Inner reveal (opening)
  const inner = new THREE.Path();
  const hw2 = hw - jamb, sh2 = sh - jamb, r2 = Math.max(0.2, r - jamb);
  inner.moveTo(-(hw2), jamb);
  inner.lineTo(-(hw2), sh2);
  inner.absarc(0, sh2, r2, Math.PI, 0, false);
  inner.lineTo(hw2, jamb);
  outer.holes.push(inner);

  const geo = new THREE.ExtrudeGeometry(outer, { depth: t, bevelEnabled:false });
  geo.center();

  return (
    <mesh position={pos} rotation={rot} geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#E9E4DB" roughness={0.85} metalness={0.05}/>
    </mesh>
  );
}
