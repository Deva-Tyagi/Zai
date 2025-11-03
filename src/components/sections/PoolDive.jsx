import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, Text as Text3D, Center } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function AnimatedFish({ position = [0, 0, 0], scale = 1, color = '#ff6b35', pathOffset = 0, yOffset = 0, radiusX = 7, radiusZ = 12 }) {
  const fishGroupRef = useRef();
  const tailRef = useRef();
  const finLeftRef = useRef();
  const finRightRef = useRef();
  const bubblesRef = useRef();
  
  const [fishPath] = useState(() => {
    const points = [];
    const segments = 100;
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      points.push({
        x: Math.sin(t + pathOffset) * radiusX + Math.cos(t * 1.5 + pathOffset) * 2,
        y: -12 + yOffset + Math.sin(t * 3 + pathOffset) * 4,
        z: Math.cos(t + pathOffset) * radiusZ + Math.sin(t * 2 + pathOffset) * 3,
      });
    }
    return points;
  });
  
  const [bubbles] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      startTime: Math.random() * 10,
      speed: 0.3 + Math.random() * 0.2,
      offset: Math.random() * Math.PI * 2
    }))
  );
  
  useFrame((state) => {
    if (fishGroupRef.current) {
      const time = state.clock.elapsedTime * 0.4 + pathOffset;
      const pathIndex = Math.floor((time * 10) % fishPath.length);
      const nextIndex = (pathIndex + 1) % fishPath.length;
      const progress = ((time * 10) % fishPath.length) - pathIndex;
      
      const current = fishPath[pathIndex];
      const next = fishPath[nextIndex];
      
      // Smooth position interpolation
      fishGroupRef.current.position.x = THREE.MathUtils.lerp(current.x, next.x, progress);
      fishGroupRef.current.position.y = THREE.MathUtils.lerp(current.y, next.y, progress);
      fishGroupRef.current.position.z = THREE.MathUtils.lerp(current.z, next.z, progress);
      
      // Calculate swimming direction
      const dx = next.x - current.x;
      const dz = next.z - current.z;
      const targetRotation = Math.atan2(dx, dz);
      fishGroupRef.current.rotation.y = targetRotation;
      
      // Subtle pitch
      const dy = next.y - current.y;
      fishGroupRef.current.rotation.x = dy * 0.3;
      
      // Animate tail
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 8 + pathOffset) * 0.4;
      }
      
      // Animate fins
      if (finLeftRef.current) {
        finLeftRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6 + pathOffset) * 0.3 + 0.3;
      }
      if (finRightRef.current) {
        finRightRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6 + pathOffset) * 0.3 - 0.3;
      }
      
      // Animate bubbles from mouth
      if (bubblesRef.current) {
        bubblesRef.current.children.forEach((bubble, i) => {
          const data = bubbles[i];
          const bubbleTime = (state.clock.elapsedTime + data.startTime) * data.speed;
          const progress = bubbleTime % 3;
          
          if (progress < 2) {
            const mouthWorldPos = new THREE.Vector3(0, 0, 0.65);
            fishGroupRef.current.localToWorld(mouthWorldPos);
            
            bubble.position.set(
              mouthWorldPos.x + Math.sin(bubbleTime + data.offset) * 0.1,
              mouthWorldPos.y + progress * 1.2,
              mouthWorldPos.z + Math.cos(bubbleTime + data.offset) * 0.1
            );
            bubble.visible = true;
            bubble.scale.setScalar(0.04 + progress * 0.02);
          } else {
            bubble.visible = false;
          }
        });
      }
    }
  });
  
  return (
    <group ref={fishGroupRef} scale={scale}>
      {/* Fish Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Fish Head/Snout */}
      <mesh position={[0, 0, 0.4]} castShadow>
        <coneGeometry args={[0.3, 0.5, 16]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.2, 0.15, 0.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 0.15, 0.52]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 0.15, 0.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.2, 0.15, 0.52]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Dorsal Fin */}
      <mesh position={[0, 0.4, -0.1]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.25, 0.6, 8]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.5} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Side Fins */}
      <group ref={finLeftRef} position={[0.4, -0.1, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.5} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      </group>
      
      <group ref={finRightRef} position={[-0.4, -0.1, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.5} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      </group>
      
      {/* Tail */}
      <group ref={tailRef} position={[0, 0, -0.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.4, 0.6, 3]} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.5} 
            transparent 
            opacity={0.9}
          />
        </mesh>
      </group>
      
      {/* Subtle glow */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color={color} distance={3} />
      
      {/* Tiny bubbles from mouth */}
      <group ref={bubblesRef}>
        {bubbles.map((_, i) => (
          <mesh key={i} visible={false}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.4} 
              roughness={0.1}
              metalness={0.05}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RealisticWater() {
  const waterRef = useRef();
  const { camera } = useThree();
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      waterRef.current.material.uniforms.uCameraPos.value.copy(camera.position);
    }
  });
  const waterMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uCameraPos: { value: new THREE.Vector3() },
      uDeepColor: { value: new THREE.Color('#0a4d5c') }, 
      uShallowColor: { value: new THREE.Color('#1a8a9f') },
      uSurfaceColor: { value: new THREE.Color('#5eb8cc') }, 
      uFoamColor: { value: new THREE.Color('#a5e8f5') }
    },
    vertexShader: `
      uniform float uTime; 
      varying vec2 vUv; 
      varying vec3 vPosition; 
      varying vec3 vNormal; 
      varying float vElevation;
      
      float snoise(vec3 v){
        const vec2 C=vec2(1./6.,1./3.);
        const vec4 D=vec4(0.,.5,1.,2.);
        vec3 i=floor(v+dot(v,C.yyy));
        vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);
        vec3 l=1.-g;
        vec3 i1=min(g.xyz,l.zxy);
        vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;
        vec3 x2=x0-i2+C.yyy;
        vec3 x3=x0-D.yyy;
        i=mod(v-floor(v/289.)*289.,289.);
        vec4 p=mod(((mod(i.z+vec4(0.,i1.z,i2.z,1.),289.)+mod(i.y+vec4(0.,i1.y,i2.y,1.),289.))*34.+1.)*(mod(i.y+vec4(0.,i1.y,i2.y,1.),289.)+mod(i.x+vec4(0.,i1.x,i2.x,1.),289.)),289.);
        float n_=.142857142857;
        vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);
        vec4 y_=floor(j-7.*x_);
        vec4 x=x_*ns.x+ns.yyyy;
        vec4 y=y_*ns.x+ns.yyyy;
        vec4 h=1.-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);
        vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;
        vec4 s1=floor(b1)*2.+1.;
        vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
        vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);
        vec3 p1=vec3(a0.zw,h.y);
        vec3 p2=vec3(a1.xy,h.z);
        vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=1.79284291400159-.85373472095314*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));
        p0*=norm.x;
        p1*=norm.y;
        p2*=norm.z;
        p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
        return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
      
      void main(){
        vUv=uv;
        vPosition=position;
        vec3 pos=position;
        float wave1=snoise(vec3(pos.x*.3+uTime*.4,pos.z*.3,uTime*.2))*.08;
        float wave2=snoise(vec3(pos.x*.6-uTime*.3,pos.z*.6,uTime*.15))*.04;
        float wave3=snoise(vec3(pos.x*1.2+uTime*.5,pos.z*1.2,uTime*.25))*.02;
        vElevation=wave1+wave2+wave3;
        pos.y+=vElevation;
        float offset=.1;
        vec3 tangent1=vec3(offset,snoise(vec3((pos.x+offset)*.3+uTime*.4,pos.z*.3,uTime*.2))*.08-vElevation,0.);
        vec3 tangent2=vec3(0.,snoise(vec3(pos.x*.3+uTime*.4,(pos.z+offset)*.3,uTime*.2))*.08-vElevation,offset);
        vNormal=normalize(cross(tangent1,tangent2));
        gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
      }
    `,
    fragmentShader: `
      uniform float uTime; 
      uniform vec3 uCameraPos; 
      uniform vec3 uDeepColor; 
      uniform vec3 uShallowColor; 
      uniform vec3 uSurfaceColor; 
      uniform vec3 uFoamColor; 
      varying vec2 vUv; 
      varying vec3 vPosition; 
      varying vec3 vNormal; 
      varying float vElevation;
      
      void main(){
        float depth=abs(vPosition.y);
        vec3 baseColor=mix(uShallowColor,uDeepColor,smoothstep(0.,5.,depth));
        float caustic=(sin(vUv.x*30.+uTime*.8)*.5+.5)*(sin(vUv.y*30.+uTime*.6)*.5+.5)+(sin(vUv.x*20.-uTime*.5)*.5+.5)*(sin(vUv.y*20.+uTime*.7)*.5+.5);
        vec3 color=baseColor+caustic*.075;
        vec3 viewDirection=normalize(uCameraPos-vPosition);
        float fresnel=pow(1.-max(dot(viewDirection,vNormal),0.),3.);
        color=mix(color,uSurfaceColor,fresnel*.3);
        color+=smoothstep(0.,3.,depth)*.2;
        if(vElevation>.05)color=mix(color,uFoamColor,smoothstep(.05,.08,vElevation)*.6);
        float alpha=min(.85+depth*.05,.95);
        gl_FragColor=vec4(color,alpha);
      }
    `
  }), []);
  
  return (
    <mesh ref={waterRef} rotation={[-Math.PI/2,0,0]} position={[0,0,0]} material={waterMaterial}>
      <planeGeometry args={[30,80,250,500]}/>
    </mesh>
  );
}

// function UnderwaterParticles({count=5000}){
//   const particlesRef=useRef();
//   const positions=useMemo(()=>{
//     const pos=new Float32Array(count*3);
//     for(let i=0;i<count;i++){
//       pos[i*3]=(Math.random()-.5)*30;
//       pos[i*3+1]=Math.random()*35-30;
//       pos[i*3+2]=(Math.random()-.5)*60;
//     }
//     return pos;
//   },[count]);
  
//   useFrame((state)=>{
//     if(particlesRef.current){
//       particlesRef.current.material.uniforms.uTime.value=state.clock.elapsedTime;
//     }
//   });
  
//   const particleMaterial=useMemo(()=>new THREE.ShaderMaterial({
//     transparent:true,
//     depthWrite:false,
//     blending:THREE.AdditiveBlending,
//     uniforms:{uTime:{value:0}},
//     vertexShader:`
//       uniform float uTime; 
//       varying float vAlpha; 
      
//       void main(){
//         vec3 pos=position;
//         pos.x+=sin(uTime*.5+position.y*.5)*.3;
//         pos.y+=mod(uTime*.4+position.y*.1,35.)-30.;
//         pos.z+=cos(uTime*.3+position.x*.3)*.2;
//         vAlpha=.3+sin(uTime*2.+position.x*10.)*.2;
//         vec4 mvPosition=modelViewMatrix*vec4(pos,1.);
//         gl_PointSize=2.5*(1.-mvPosition.z*.05);
//         gl_Position=projectionMatrix*mvPosition;
//       }
//     `,
//     fragmentShader:`
//       varying float vAlpha; 
      
//       void main(){
//         float dist=length(gl_PointCoord-vec2(.5));
//         if(dist>.5)discard;
//         gl_FragColor=vec4(.8,.9,1.,(1.-dist*2.)*vAlpha*.4);
//       }
//     `
//   }),[]);
  
//   return (
//     <points ref={particlesRef} material={particleMaterial}>
//       <bufferGeometry>
//         <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
//       </bufferGeometry>
//     </points>
//   );
// }

function PoolWalls(){
  const wallProps={color:"#2d6a7a",roughness:.6};
  return (
    <group>
      <mesh position={[-12,-15,0]}>
        <boxGeometry args={[.5,30,70]}/>
        <meshStandardMaterial {...wallProps}/>
      </mesh>
      <mesh position={[12,-15,0]}>
        <boxGeometry args={[.5,30,70]}/>
        <meshStandardMaterial {...wallProps}/>
      </mesh>
      <mesh position={[0,-15,-35]}>
        <boxGeometry args={[25,30,.5]}/>
        <meshStandardMaterial {...wallProps}/>
      </mesh>
      <mesh position={[0,-15,35]}>
        <boxGeometry args={[25,30,.5]}/>
        <meshStandardMaterial {...wallProps}/>
      </mesh>
    </group>
  );
}

function UnderwaterPlant({position=[0,0,0]}){
  const plantRef=useRef();
  
  useFrame((state)=>{
    if(plantRef.current){
      plantRef.current.children.forEach((leaf,i)=>{
        leaf.rotation.z=Math.sin(state.clock.elapsedTime*.8+i*.5)*.2;
      });
    }
  });
  
  return (
    <group ref={plantRef} position={position}>
      {Array.from({length:8}).map((_,i)=>(
        <mesh key={i} position={[0,-28+(.6+i*.15),0]} rotation={[0,(i/8)*Math.PI*2,0]}>
          <coneGeometry args={[.08,(.6+i*.15)*.4,8]}/>
          <meshStandardMaterial color="#2d5a3a" roughness={.7} transparent opacity={.8}/>
        </mesh>
      ))}
      <mesh position={[0,-26,0]}>
        <cylinderGeometry args={[.03,.04,2,8]}/>
        <meshStandardMaterial color="#3d6a4a" roughness={.8}/>
      </mesh>
    </group>
  );
}

function UnderwaterRocks(){
  const rocks=useMemo(()=>Array.from({length:25},()=>({
    position:[(Math.random()-.5)*20,-29-Math.random()*2,(Math.random()-.5)*50],
    scale:.3+Math.random()*.5,
    rotation:[Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI]
  })),[]);
  
  return (
    <group>
      {rocks.map((rock,i)=>(
        <mesh key={i} position={rock.position} rotation={rock.rotation} scale={rock.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[1,0]}/>
          <meshStandardMaterial color="#4a5a5a" roughness={.9} metalness={.1}/>
        </mesh>
      ))}
    </group>
  );
}

function DiveBubbles({show}){
  const bubblesRef=useRef();
  const [bubbleData]=useState(()=>
    Array.from({length:80},()=>({
      startPos:[
        (Math.random()-.5)*6,
        -1.5,
        (Math.random()-.5)*6 + 2
      ],
      speed:0.5+Math.random()*1,
      scale:0.1+Math.random()*0.2,
      offset:Math.random()*Math.PI*2
    }))
  );
  
  useFrame((state)=>{
    if(bubblesRef.current && show){
      const time=state.clock.elapsedTime;
      bubblesRef.current.children.forEach((bubble,i)=>{
        const data=bubbleData[i];
        const progress=(time*data.speed)%3;
        
        if(progress<2){
          bubble.position.set(
            data.startPos[0]+Math.sin(time*0.5+data.offset)*0.3,
            data.startPos[1]+progress*3,
            data.startPos[2]+Math.cos(time*0.3+data.offset)*0.2
          );
          bubble.visible=true;
          bubble.scale.setScalar(data.scale*(1+progress*0.5));
        }else{
          bubble.visible=false;
        }
      });
    }else if(bubblesRef.current){
      bubblesRef.current.children.forEach(bubble=>{
        bubble.visible=false;
      });
    }
  });
  
  return (
    <group ref={bubblesRef}>
      {bubbleData.map((_,i)=>(
        <mesh key={i} visible={false}>
          <sphereGeometry args={[1,8,8]}/>
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.3} 
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function ServiceCard({position,frontTitle,frontDescription,frontIcon,backTitle,backDescription,backIcon,opacity,oblique}){
  const cardRef=useRef();
  const frontTextRef=useRef();
  const backTextRef=useRef();
  
  useFrame((state)=>{
    if(cardRef.current){
      const floatAmount=Math.sin(state.clock.elapsedTime*.4+position[0])*.15;
      cardRef.current.position.y=position[1]+floatAmount;
      
      if(!oblique) {
        cardRef.current.rotation.x=Math.sin(state.clock.elapsedTime*.3+position[0])*.06;
        cardRef.current.rotation.z=Math.sin(state.clock.elapsedTime*.2+position[0])*.03;
      }
    }
    
    if(frontTextRef.current){
      frontTextRef.current.children.forEach(child=>{
        if(child.material){child.material.opacity=opacity;}
      });
    }
    if(backTextRef.current){
      backTextRef.current.children.forEach(child=>{
        if(child.material){child.material.opacity=opacity;}
      });
    }
  });
  
  return (
    <group ref={cardRef} position={position} rotation={oblique ? [0, Math.PI/6, 0] : [0, 0, 0]}>
      <mesh position={[.05,-.05,-.15]} castShadow>
        <boxGeometry args={[3.3,3.9,.3]}/>
        <meshStandardMaterial color="#0a2a3a" transparent opacity={opacity*.5} roughness={.8}/>
      </mesh>
      
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2,3.8,.4]}/>
        <meshStandardMaterial color="#1a5a6a" transparent opacity={opacity*.95} roughness={.3} metalness={.4} emissive="#2a7a8a" emissiveIntensity={.3}/>
      </mesh>
      
      <mesh position={[0,0,.21]}>
        <boxGeometry args={[3.1,3.7,.02]}/>
        <meshStandardMaterial color="#2a6a7a" transparent opacity={opacity*.98} roughness={.2} metalness={.5} emissive="#3a8a9a" emissiveIntensity={.2}/>
      </mesh>
      <mesh position={[0,1.2,.23]}>
        <circleGeometry args={[.45,32]}/>
        <meshStandardMaterial color="#4a9aaa" transparent opacity={opacity*.95} emissive="#6aaaaa" emissiveIntensity={.5}/>
      </mesh>
      <group ref={frontTextRef} position={[0,0,.25]}>
        <Center position={[0,1.2,0]}>
          <Text3D fontSize={.4} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
            {frontIcon}
          </Text3D>
        </Center>
        <Center position={[0,.35,0]}>
          <Text3D fontSize={.22} color="#a0e8ff" anchorX="center" anchorY="middle" fontWeight={700} maxWidth={2.5} textAlign="center">
            {frontTitle}
          </Text3D>
        </Center>
        <Center position={[0,-.8,0]}>
          <Text3D fontSize={.11} color="#d0f0ff" anchorX="center" anchorY="middle" maxWidth={2.3} lineHeight={1.4} textAlign="center">
            {frontDescription}
          </Text3D>
        </Center>
      </group>
      
      <mesh position={[0,0,-.21]} rotation={[0,Math.PI,0]}>
        <boxGeometry args={[3.1,3.7,.02]}/>
        <meshStandardMaterial color="#2a6a7a" transparent opacity={opacity*.98} roughness={.2} metalness={.5} emissive="#3a8a9a" emissiveIntensity={.2}/>
      </mesh>
      <mesh position={[0,1.2,-.23]} rotation={[0,Math.PI,0]}>
        <circleGeometry args={[.45,32]}/>
        <meshStandardMaterial color="#4a9aaa" transparent opacity={opacity*.95} emissive="#6aaaaa" emissiveIntensity={.5}/>
      </mesh>
      <group ref={backTextRef} position={[0,0,-.25]} rotation={[0,Math.PI,0]}>
        <Center position={[0,1.2,0]}>
          <Text3D fontSize={.4} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
            {backIcon}
          </Text3D>
        </Center>
        <Center position={[0,.35,0]}>
          <Text3D fontSize={.22} color="#a0e8ff" anchorX="center" anchorY="middle" fontWeight={700} maxWidth={2.5} textAlign="center">
            {backTitle}
          </Text3D>
        </Center>
        <Center position={[0,-.8,0]}>
          <Text3D fontSize={.11} color="#d0f0ff" anchorX="center" anchorY="middle" maxWidth={2.3} lineHeight={1.4} textAlign="center">
            {backDescription}
          </Text3D>
        </Center>
      </group>
      
      <pointLight position={[0,0,.6]} intensity={.5*opacity} color="#5eb8cc" distance={5}/>
      <pointLight position={[0,0,-.6]} intensity={.5*opacity} color="#5eb8cc" distance={5}/>
    </group>
  );
}

function ServiceCards({cardOpacity}){
  return (
    <group position={[0,-26,0]}>
      <ServiceCard 
        position={[-4.5,0,0]} 
        oblique={true}
        frontIcon="🏠" 
        frontTitle="Residential Design" 
        frontDescription="Transform your living spaces with elegant, functional interior solutions tailored to your lifestyle and aesthetic preferences."
        backIcon="🎨" 
        backTitle="Color Consultation" 
        backDescription="Expert color palette selection and coordination to create harmonious and vibrant spaces that reflect your personality."
        opacity={cardOpacity}
      />
      <ServiceCard 
        position={[0,0,0]} 
        oblique={true}
        frontIcon="🏢" 
        frontTitle="Commercial Spaces" 
        frontDescription="Create inspiring work environments that boost productivity while reflecting your brand identity through thoughtful design."
        backIcon="🏨" 
        backTitle="Hospitality Design" 
        backDescription="Luxurious and welcoming interior solutions for hotels, restaurants, and resorts that create memorable guest experiences."
        opacity={cardOpacity}
      />
      <ServiceCard 
        position={[4.5,0,0]} 
        oblique={true}
        frontIcon="🪑" 
        frontTitle="Custom Furniture" 
        frontDescription="Bespoke furniture pieces crafted to perfection, combining artisanal quality with innovative design for your unique space."
        backIcon="💡" 
        backTitle="Lighting Design" 
        backDescription="Strategic lighting solutions that enhance ambiance, functionality, and architectural features of your interior spaces."
        opacity={cardOpacity}
      />
    </group>
  );
}

function UnderwaterLighting(){
  return (
    <>
      <ambientLight intensity={.35} color="#5090a0"/>
      <directionalLight position={[0,10,0]} intensity={.7} color="#a0d8f0" castShadow/>
      <pointLight position={[-8,-5,-15]} intensity={.4} color="#60b0c0" distance={20}/>
      <pointLight position={[8,-5,15]} intensity={.4} color="#60b0c0" distance={20}/>
      <pointLight position={[0,-15,0]} intensity={.5} color="#70c0d0" distance={25}/>
      <pointLight position={[0,-26,0]} intensity={.9} color="#70c0d0" distance={18}/>
      <hemisphereLight args={['#80c8d8','#2a5a6a',.4]}/>
    </>
  );
}

function DiveCameraController({cameraGroupRef,cameraRotation}){
  const {camera}=useThree();
  
  useFrame(()=>{
    if(cameraGroupRef.current){
      if(cameraRotation > 0) {
        const radius = 8;
        const angle = cameraRotation;
        const targetX = Math.sin(angle) * radius;
        const targetZ = Math.cos(angle) * radius;
        const targetY = -26;
        
        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
        camera.lookAt(0, -26, 0);
      } else {
        camera.position.lerp(cameraGroupRef.current.position, 0.08);
        camera.quaternion.slerp(new THREE.Quaternion().setFromEuler(cameraGroupRef.current.rotation), 0.08);
      }
    }
  });
  
  return null;
}

function UnderwaterScene({cameraGroupRef,cardOpacity,cameraRotation,showBubbles}){
  return (
    <>
      <DiveCameraController cameraGroupRef={cameraGroupRef} cameraRotation={cameraRotation}/>
      <UnderwaterLighting/>
      <color attach="background" args={['#0a3a4a']}/>
      <fog attach="fog" args={['#0a3a4a',10,55]}/>
      <PoolWalls/>
      {/* <UnderwaterParticles count={5000}/> */}
      <UnderwaterRocks/>
      {/* <DiveBubbles show={showBubbles}/> */}
      
      {/* Multiple swimming fish with different paths - Upper and Middle levels */}
      <AnimatedFish scale={1.2} color="#ff6b35" pathOffset={0} yOffset={0} radiusX={7} radiusZ={12} />
      <AnimatedFish scale={0.9} color="#4ecdc4" pathOffset={Math.PI * 0.5} yOffset={-3} radiusX={6} radiusZ={10} />
      <AnimatedFish scale={1.0} color="#ffe66d" pathOffset={Math.PI} yOffset={2} radiusX={8} radiusZ={14} />
      <AnimatedFish scale={1.1} color="#ff85a1" pathOffset={Math.PI * 1.5} yOffset={-1} radiusX={5} radiusZ={11} />
      <AnimatedFish scale={0.8} color="#95e1d3" pathOffset={Math.PI * 0.3} yOffset={-4} radiusX={9} radiusZ={13} />
      <AnimatedFish scale={1.3} color="#f38181" pathOffset={Math.PI * 1.2} yOffset={1} radiusX={7} radiusZ={9} />
      <AnimatedFish scale={0.95} color="#aa96da" pathOffset={Math.PI * 1.8} yOffset={-2} radiusX={6} radiusZ={15} />
      <AnimatedFish scale={1.05} color="#ffd93d" pathOffset={Math.PI * 0.7} yOffset={3} radiusX={8} radiusZ={11} />
      <AnimatedFish scale={0.85} color="#6bcf7f" pathOffset={Math.PI * 1.4} yOffset={-3} radiusX={7} radiusZ={13} />
      <AnimatedFish scale={1.15} color="#ff6b9d" pathOffset={Math.PI * 0.9} yOffset={1} radiusX={6} radiusZ={10} />
      
      {/* Bottom dwelling fish - swimming near the pool floor */}
      <AnimatedFish scale={0.9} color="#ff5722" pathOffset={0} yOffset={-14} radiusX={5} radiusZ={8} />
      <AnimatedFish scale={1.0} color="#26a69a" pathOffset={Math.PI * 0.6} yOffset={-15} radiusX={6} radiusZ={9} />
      <AnimatedFish scale={0.8} color="#ffb74d" pathOffset={Math.PI * 1.3} yOffset={-13} radiusX={4} radiusZ={7} />
      <AnimatedFish scale={1.1} color="#ab47bc" pathOffset={Math.PI * 1.9} yOffset={-14} radiusX={7} radiusZ={10} />
      <AnimatedFish scale={0.95} color="#42a5f5" pathOffset={Math.PI * 0.4} yOffset={-16} radiusX={5} radiusZ={8} />
      <AnimatedFish scale={0.85} color="#ef5350" pathOffset={Math.PI * 1.1} yOffset={-15} radiusX={6} radiusZ={9} />
      <AnimatedFish scale={1.05} color="#66bb6a" pathOffset={Math.PI * 1.7} yOffset={-14} radiusX={4} radiusZ={7} />
      <AnimatedFish scale={0.9} color="#ffa726" pathOffset={Math.PI * 0.2} yOffset={-13} radiusX={5} radiusZ={8} />
      
      <ServiceCards cardOpacity={cardOpacity}/>
      {[[-8,0,-15],[-6,0,10],[7,0,-20],[9,0,15],[-10,0,25],[5,0,-25],[-3,0,-22],[10,0,28],[-7,0,0],[8,0,-8],[-9,0,-12],[6,0,20],[-5,0,18],[4,0,-18],[-11,0,-5],[11,0,5]].map((pos,i)=>(
        <UnderwaterPlant key={i} position={pos}/>
      ))}
    </>
  );
}

export default function PoolDive(){
  const containerRef=useRef();
  const cameraGroupRef=useRef({
    position:new THREE.Vector3(0,2,8),
    rotation:new THREE.Euler(-.2,0,0)
  });
  const cardOpacityRef=useRef({value:0});
  const cameraRotationRef=useRef({value:0});
  const [dpr,setDpr]=useState(1.5);
  const [cardOpacity,setCardOpacity]=useState(0);
  const [cameraRotation,setCameraRotation]=useState(0);
  const [showBubbles,setShowBubbles]=useState(false);

  useLayoutEffect(()=>{
    if(!containerRef.current)return;
    
    const ctx=gsap.context(()=>{
      const tl=gsap.timeline({
        scrollTrigger:{
          trigger:containerRef.current,
          start:'top top',
          end:'+=1200%',
          scrub:1.5,
          pin:true,
          anticipatePin:1,
          onUpdate:(self)=>{
            if(self.progress < 0.15){
              setShowBubbles(true);
            }else{
              setShowBubbles(false);
            }
            
            if(self.progress > 0.6 && self.progress < 0.7){
              const fadeProgress = (self.progress - 0.6) / 0.1;
              cardOpacityRef.current.value = fadeProgress;
              setCardOpacity(fadeProgress);
            } else if(self.progress >= 0.7) {
              cardOpacityRef.current.value = 1;
              setCardOpacity(1);
            } else {
              cardOpacityRef.current.value = 0;
              setCardOpacity(0);
            }
            
            if(self.progress >= 0.7) {
              const rotationProgress = (self.progress - 0.7) / 0.3;
              const rotation = rotationProgress * Math.PI * 2;
              cameraRotationRef.current.value = rotation;
              setCameraRotation(rotation);
            } else {
              cameraRotationRef.current.value = 0;
              setCameraRotation(0);
            }
          }
        }
      });
      
      tl.to(cameraGroupRef.current.position,{x:0,y:0,z:6,duration:.06})
        .to(cameraGroupRef.current.rotation,{x:-.3,y:0,z:0,duration:.06},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-3,z:3,duration:.08})
        .to(cameraGroupRef.current.rotation,{x:-.5,y:0,z:0,duration:.08},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-7,z:0,duration:.1})
        .to(cameraGroupRef.current.rotation,{x:-.8,y:0,z:0,duration:.1},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-12,z:-2,duration:.11})
        .to(cameraGroupRef.current.rotation,{x:-1.1,y:0,z:0,duration:.11},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-17,z:-3,duration:.11})
        .to(cameraGroupRef.current.rotation,{x:-1.3,y:0,z:0,duration:.11},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-22,z:-2,duration:.11})
        .to(cameraGroupRef.current.rotation,{x:-1.4,y:0,z:0,duration:.11},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-26,z:8,duration:.13})
        .to(cameraGroupRef.current.rotation,{x:0,y:0,z:0,duration:.13},'<')
        .to(cameraGroupRef.current.position,{x:0,y:-26,z:8,duration:.3});
    },containerRef);
    
    return ()=>ctx.revert();
  },[]);

  return (
    <div ref={containerRef} style={{width:'100vw',height:'100vh',overflow:'hidden',position:'relative',background:'#0a3a4a'}}>
      <div style={{height:'1300vh',position:'absolute',top:0,left:0,width:'1px',pointerEvents:'none'}}/>
      <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#0a3a4a'}}>
        <Canvas shadows dpr={dpr} camera={{position:[0,2,8],fov:60}} style={{width:'100%',height:'100%'}} gl={{antialias:true,alpha:false}}>
          <color attach="background" args={['#0a3a4a']}/>
          <AdaptiveDpr pixelated/>
          <PerformanceMonitor onIncline={()=>setDpr(Math.min(2,window.devicePixelRatio))} onDecline={()=>setDpr(1)}/>
          <UnderwaterScene cameraGroupRef={cameraGroupRef} cardOpacity={cardOpacity} cameraRotation={cameraRotation} showBubbles={showBubbles}/>
        </Canvas>
      </div>
      <div style={{position:'fixed',top:'5%',right:'5%',color:'#a0e8ff',fontFamily:'system-ui, -apple-system, sans-serif',fontSize:'.9rem',pointerEvents:'none',background:'rgba(42, 106, 122, 0.6)',padding:'1rem 1.5rem',borderRadius:'20px',backdropFilter:'blur(8px)',border:'1px solid rgba(255, 255, 255, 0.1)',zIndex:100}}>
        🏊 Scroll to dive & watch the fish swim
      </div>
    </div>
  );
}