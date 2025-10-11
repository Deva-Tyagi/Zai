// Subtle tile grid under the water using a shader (no textures)
import * as THREE from 'three';
import { useMemo } from 'react';

export default function PoolTiles({ w=6.2, h=3.0, pos=[0,-0.01,0] }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#3A8C97') } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform vec3 uColor;
      float grid(vec2 uv, float lines){
        vec2 g = abs(fract(uv*lines-0.5)-0.5)/fwidth(uv*lines);
        float l = 1.0 - min(min(g.x,g.y),1.0);
        return smoothstep(0.7,1.0,l);
      }
      void main(){
        vec3 base = uColor;
        float g = grid(vUv, 18.0)*0.25;
        gl_FragColor = vec4(base + vec3(g*0.15), 1.0);
      }`,
  }), []);
  return (
    <mesh position={pos} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[w,h,1,1]}/>
      <primitive object={mat} attach="material"/>
    </mesh>
  );
}
