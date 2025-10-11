// src/components/3d/Villa/VillaLighting.jsx
export default function VillaLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[7, 10, 6]} intensity={1.15} color={'#FFB75D'} castShadow />
      <directionalLight position={[-7, 6, -3]} intensity={0.35} color={'#6A4C93'} />
    </>
  );
}
