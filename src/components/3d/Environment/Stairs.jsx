export default function Stairs({ steps=5, w=4.6, tread=0.34, riser=0.16, pos=[0,0,0] }) {
  return (
    <group position={pos}>
      {Array.from({ length: steps }).map((_, i) => (
        <mesh key={i} position={[0, i*riser*0.5, i*tread*0.5]} castShadow receiveShadow>
          <boxGeometry args={[w - i*0.15, riser, tread*(i+1)]}/>
          <meshStandardMaterial color="#E9E4DB" roughness={0.85} metalness={0.05}/>
        </mesh>
      ))}
    </group>
  );
}
