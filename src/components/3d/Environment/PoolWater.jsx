import * as THREE from 'three';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function PoolWater({ w=6.2, h=3.0, pos=[0,0,0] }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0}, a:{value:0.015}, b:{value:0.012}, c:{value:0.008},
      deep:{value:new THREE.Color('#3D8EA3')}, shallow:{value:new THREE.Color('#58B0BF')}
    },
    vertexShader: `
      uniform float uTime; uniform float a; uniform float b; uniform float c;
      varying float vW; varying vec2 vUv;
      void main(){
        vUv = uv;
        vec3 p = position;
        float w1 = sin(p.x*3.2 + uTime*0.9)*a;
        float w2 = cos(p.y*2.4 + uTime*1.2)*b;
        float w3 = sin((p.x+p.y)*1.6 - uTime*0.6)*c;
        vW = w1+w2+w3; p.z += vW;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader: `
      varying float vW; varying vec2 vUv;
      uniform vec3 deep; uniform vec3 shallow;
      void main(){
        float fres = smoothstep(0.0, 0.25, abs(vW)*12.0);
        vec3 col = mix(deep, shallow, vUv.y*0.6 + 0.2) + fres*0.08;
        gl_FragColor = vec4(col, 0.95);
      }`,
    transparent: true
  }), []);
  useFrame((_,dt)=>{ mat.uniforms.uTime.value += dt; });
  return (
    <mesh position={pos} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[w,h,128,128]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}
