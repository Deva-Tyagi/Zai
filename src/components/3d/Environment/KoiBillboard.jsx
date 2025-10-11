// Instanced camera-facing koi with shader tail wag (no textures)
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function KoiBillboard({ count=18, area=[5.2, 2.0], y=-0.22, base='#FFC07A' }) {
  const { camera } = useThree();
  const geom = useMemo(()=>new THREE.PlaneGeometry(0.38, 0.16),[]);
  const mat = useMemo(()=>new THREE.ShaderMaterial({
    uniforms:{ uTime:{value:0}, uColor:{ value:new THREE.Color(base) } },
    vertexShader: `
      uniform float uTime; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec3 p = position;
        float wag = sin(uTime*4.0 + position.y*10.0) * 0.06 * smoothstep(0.0,1.0,uv.x);
        p.x += wag;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      varying vec2 vUv; uniform vec3 uColor;
      void main(){
        float body = smoothstep(0.1, 0.0, abs(vUv.y-0.5));
        float head = smoothstep(0.35, 0.0, vUv.x);
        float mask = max(body*head, 0.0);
        vec3 c = mix(vec3(0.0), uColor, mask);
        gl_FragColor = vec4(c, mask);
      }`,
    transparent:true, depthWrite:false
  }),[base]);

  const mesh = useRef();
  const seeds = useMemo(()=>Array.from({length:count}, ()=>({
    a: Math.random()*Math.PI*2, s: 0.35 + Math.random()*0.45, r: 0.6 + Math.random()*1.0
  })),[count]);
  const m4 = useMemo(()=>new THREE.Matrix4(),[]);

  useFrame(({ clock })=>{
    mat.uniforms.uTime.value = clock.getElapsedTime();
    if(!mesh.current) return;
    for(let i=0;i<count;i++){
      const { a, s, r } = seeds[i];
      const t = clock.getElapsedTime()*s + a;
      const px = Math.cos(t) * (area[0]*0.4 + r);
      const pz = Math.sin(t) * (area[1]*0.4 + r*0.3);
      const p = new THREE.Vector3(px, y, pz);
      // Face the camera (billboard)
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(p, camera.position, new THREE.Vector3(0,1,0)));
      m4.compose(p, q, new THREE.Vector3(1,1,1));
      mesh.current.setMatrixAt(i, m4);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geom, mat, count]} />;
}
