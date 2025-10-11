import Arch from './Arch';

export default function Arcade({ count=6, spacing=2.6, y=0, z=0, ...rest }) {
  return (
    <group position={[0,y,z]}>
      {Array.from({ length: count }).map((_, i) => (
        <Arch key={i} pos={[ (i - (count-1)/2)*spacing, 0, 0 ]} {...rest}/>
      ))}
    </group>
  );
}
