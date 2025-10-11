// Curved canopy ribs + slats
export default function Pergola({ span=10, depth=3.2, ribs=9, y=3.4, z=-0.6 }) {
  const items = Array.from({ length: ribs });
  return (
    <group position={[0,y,z]}>
      {items.map((_, i) => {
        const x = (i - (ribs-1)/2) * (span/(ribs-1));
        return (
          <group key={i} position={[x,0,0]}>
            <mesh rotation={[0,0,0]}>
              <torusGeometry args={[depth*0.5, 0.05, 8, 36, Math.PI]} />
              <meshStandardMaterial color="#6E5846" roughness={0.7}/>
            </mesh>
            <mesh position={[0, -0.02, -depth*0.5*0.9]}>
              <boxGeometry args={[0.06, 0.02, depth*0.9]} />
              <meshStandardMaterial color="#6E5846" roughness={0.7}/>
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
