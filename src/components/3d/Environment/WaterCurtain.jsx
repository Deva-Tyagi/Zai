import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaterCurtain({ width=2.2, height=3.0, count=14000, origin=[-1.4,2.2,-0.6] }) {
  const geo = useMemo(()=>new THREE.BufferGeometry(),[]);
  const ref = useRef();

  useMemo(()=>{
    const p = new Float32Array(count*3);
    const s = new Float32Array(count);
    for(let i=0;i<count;i++){
      p[i*3+0] = (Math.random()-0.5)*width;
      p[i*3+1] = Math.random()*height;
      p[i*3+2] = 0;
      s[i] = Math.random()*6.28318;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(p,3));
    geo.setAttribute('seed', new THREE.BufferAttribute(s,1));
  },[geo,width,height,count]);

  useFrame(({ clock })=>{
    const t = clock.getElapsedTime();
    const pos = geo.getAttribute('position');
    const seed = geo.getAttribute('seed');
    for(let i=0;i<pos.count;i++){
      let y = pos.getY(i) - (0.022 + 0.012*Math.sin(seed.getX(i)+t*1.2));
      if(y<0.0) y = height;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t*0.35 + i*0.001)*0.0008);
    }
    pos.needsUpdate = true;
    if(ref.current) ref.current.rotation.y = 0.02*Math.sin(t*0.2);
  });

  return (
    <points ref={ref} position={origin} geometry={geo}>
      <pointsMaterial color="#9adff2" size={0.014} sizeAttenuation transparent opacity={0.85}/>
    </points>
  );
}
