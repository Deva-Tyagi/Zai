import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== ENHANCED LIGHTING =====
function VillaLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF8E7" />
      <directionalLight
        position={[20, 25, 15]}
        intensity={1.5}
        color="#FFE4B5"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={70}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight position={[-15, 18, -10]} intensity={0.5} color="#D4C4AC" />
      <spotLight position={[0, 15, 0]} intensity={0.3} angle={0.5} penumbra={0.5} color="#FFFACD" />
      <hemisphereLight args={['#FFFAF0', '#D4BFA0', 0.4]} />
    </>
  );
}

// ===== ENHANCED ARCH WITH CAPITALS =====
function Arch({ position = [0, 0, 0], width = 2.8, height = 4.5, depth = 0.8 }) {
  return (
    <group position={position}>
      {/* Left pillar with base and capital */}
      <mesh castShadow receiveShadow position={[-width/2, 0.15, 0]}>
        <boxGeometry args={[0.65, 0.3, depth + 0.15]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[-width/2, height/2 + 0.15, 0]}>
        <boxGeometry args={[0.5, height - 0.3, depth]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
      </mesh>
      <mesh castShadow receiveShadow position={[-width/2, height + 0.15, 0]}>
        <boxGeometry args={[0.7, 0.35, depth + 0.2]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.8} />
      </mesh>
      
      {/* Right pillar with base and capital */}
      <mesh castShadow receiveShadow position={[width/2, 0.15, 0]}>
        <boxGeometry args={[0.65, 0.3, depth + 0.15]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[width/2, height/2 + 0.15, 0]}>
        <boxGeometry args={[0.5, height - 0.3, depth]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
      </mesh>
      <mesh castShadow receiveShadow position={[width/2, height + 0.15, 0]}>
        <boxGeometry args={[0.7, 0.35, depth + 0.2]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.8} />
      </mesh>
      
      {/* Enhanced arch curve */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 17) * Math.PI;
        const x = Math.cos(angle) * (width / 2);
        const y = height + 0.3 + Math.sin(angle) * (width / 2);
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, -angle]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.28, depth]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
          </mesh>
        );
      })}
      
      {/* Inner arch depth with texture detail */}
      <mesh position={[0, height/2, -depth/4]} receiveShadow>
        <boxGeometry args={[width, height, depth/2]} />
        <meshStandardMaterial color="#CDB89A" roughness={0.9} />
      </mesh>
      
      {/* Decorative keystone */}
      <mesh position={[0, height + width/2 + 0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, depth + 0.1]} />
        <meshStandardMaterial color="#C9B89A" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ===== ENHANCED ARCADE WITH DETAILED ROOF =====
function Arcade({ position = [0, 0, 0], count = 5, spacing = 3.5 }) {
  const totalLength = count * spacing;
  
  return (
    <group position={position}>
      {/* Textured back wall with panels */}
      <mesh position={[0, 3, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 6, totalLength]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      
      {/* Wall decorative panels */}
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={`panel-${i}`} position={[0, 2.5, i * spacing - 1]} receiveShadow>
          <boxGeometry args={[0.05, 1.5, 1.8]} />
          <meshStandardMaterial color="#D4C4AC" roughness={0.85} />
        </mesh>
      ))}
      
      {/* Detailed floor tiles */}
      <mesh position={[0, 0.01, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, totalLength, 8, 20]} />
        <meshStandardMaterial color="#F5EFE7" roughness={0.9} />
      </mesh>
      
      {/* Terracotta floor border */}
      <mesh position={[-2, 0.02, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.5, totalLength]} />
        <meshStandardMaterial color="#C9A882" roughness={0.85} />
      </mesh>
      <mesh position={[2, 0.02, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.5, totalLength]} />
        <meshStandardMaterial color="#C9A882" roughness={0.85} />
      </mesh>
      
      {/* Enhanced roof structure */}
      <mesh position={[0, 6.3, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[5.5, totalLength + 0.8]} />
        <meshStandardMaterial color="#B89968" roughness={0.8} />
      </mesh>
      
      {/* Roof tiles detail */}
      {Array.from({ length: Math.floor(totalLength / 0.8) }).map((_, i) => (
        <mesh key={`tile-${i}`} position={[0, 6.25, i * 0.8 - totalLength / 2 + spacing]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[5.5, 0.15]} />
          <meshStandardMaterial color="#A08050" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Decorative roof edges */}
      <mesh position={[2.75, 6.2, totalLength / 2 - spacing / 2]} castShadow>
        <boxGeometry args={[0.25, 0.3, totalLength + 0.8]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.75} />
      </mesh>
      <mesh position={[-2.75, 6.2, totalLength / 2 - spacing / 2]} castShadow>
        <boxGeometry args={[0.25, 0.3, totalLength + 0.8]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.75} />
      </mesh>
      
      {/* Support beams */}
      <mesh position={[0, 6.5, -spacing / 2]} castShadow>
        <boxGeometry args={[5, 0.2, 0.3]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      <mesh position={[0, 6.5, totalLength - spacing / 2]} castShadow>
        <boxGeometry args={[5, 0.2, 0.3]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      
      {/* Arches */}
      {Array.from({ length: count }).map((_, i) => (
        <Arch key={i} position={[0, 0, i * spacing]} width={2.8} height={4.5} depth={0.8} />
      ))}
    </group>
  );
}

// ===== ENHANCED PERGOLA =====
function Pergola({ position = [0, 0, 0], width = 4, length = 18, slats = 40 }) {
  return (
    <group position={position}>
      {/* Support posts */}
      <mesh position={[-width/2, -2.5, -length/2 + 1]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 5, 12]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      <mesh position={[width/2, -2.5, -length/2 + 1]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 5, 12]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      <mesh position={[-width/2, -2.5, length/2 - 1]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 5, 12]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      <mesh position={[width/2, -2.5, length/2 - 1]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 5, 12]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      
      {/* Main beams */}
      <mesh position={[-width/2, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.25, length]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      <mesh position={[width/2, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 0.25, length]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      
      {/* Cross slats with variation */}
      {Array.from({ length: slats }).map((_, i) => (
        <mesh key={i} position={[0, 0.12, (i / slats - 0.5) * length]} castShadow>
          <boxGeometry args={[width + 0.4, 0.1, 0.12]} />
          <meshStandardMaterial color="#A0826D" roughness={0.65} />
        </mesh>
      ))}
      
      {/* Decorative end caps */}
      <mesh position={[0, 0, length/2 + 0.2]} castShadow>
        <boxGeometry args={[width + 0.5, 0.2, 0.15]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, -length/2 - 0.2]} castShadow>
        <boxGeometry args={[width + 0.5, 0.2, 0.15]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ===== ENHANCED POOL =====
function Pool({ position = [0, 0, 0], width = 8, length = 14, depth = 1.2 }) {
  const waterRef = useRef();
  
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const waterMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color('#2A7A8C') },
      uShallowColor: { value: new THREE.Color('#5CB8CC') },
      uFoamColor: { value: new THREE.Color('#A0D8E8') }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPos;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        pos.z += sin(pos.x * 3.5 + uTime * 0.9) * 0.03;
        pos.z += cos(pos.y * 3.0 + uTime * 0.7) * 0.025;
        pos.z += sin(pos.x * 2.0 + pos.y * 1.5 + uTime * 1.2) * 0.02;
        
        vPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uDeepColor;
      uniform vec3 uShallowColor;
      uniform vec3 uFoamColor;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPos;
      
      void main() {
        float depth = length(vUv - 0.5) * 1.5;
        vec3 color = mix(uShallowColor, uDeepColor, depth);
        
        float caustic = sin(vUv.x * 25.0 + uTime * 0.6) * 0.5 + 0.5;
        caustic *= sin(vUv.y * 25.0 + uTime * 0.8) * 0.5 + 0.5;
        caustic += sin(vUv.x * 15.0 - uTime * 0.4) * 0.3;
        color += caustic * 0.2;
        
        float edgeDistance = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        float foam = smoothstep(0.0, 0.06, edgeDistance);
        color = mix(uFoamColor, color, foam);
        
        gl_FragColor = vec4(color, 0.9);
      }
    `
  }), []);

  return (
    <group position={position}>
      {/* Mosaic pool floor */}
      <mesh position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length, 50, 70]} />
        <meshStandardMaterial 
          color="#3A9AAA" 
          roughness={0.25} 
          metalness={0.15}
        />
      </mesh>
      
      {/* Decorative tile pattern on floor */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`floor-${i}`} position={[0, -depth + 0.01, (i - 3.5) * 1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[width - 0.5, 0.15]} />
          <meshStandardMaterial color="#2A7A8C" roughness={0.3} />
        </mesh>
      ))}
      
      {/* Pool walls with tile detail */}
      <mesh position={[-width/2, -depth/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, depth, length]} />
        <meshStandardMaterial color="#2D7A8A" roughness={0.4} />
      </mesh>
      <mesh position={[width/2, -depth/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, depth, length]} />
        <meshStandardMaterial color="#2D7A8A" roughness={0.4} />
      </mesh>
      <mesh position={[0, -depth/2, -length/2]} receiveShadow castShadow>
        <boxGeometry args={[width, depth, 0.2]} />
        <meshStandardMaterial color="#2D7A8A" roughness={0.4} />
      </mesh>
      <mesh position={[0, -depth/2, length/2]} receiveShadow castShadow>
        <boxGeometry args={[width, depth, 0.2]} />
        <meshStandardMaterial color="#2D7A8A" roughness={0.4} />
      </mesh>
      
      {/* Water surface */}
      <mesh 
        ref={waterRef} 
        position={[0, 0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        material={waterMaterial}
      >
        <planeGeometry args={[width, length, 180, 220]} />
      </mesh>
      
      {/* Enhanced pool coping/edge */}
      <mesh position={[-width/2 - 0.2, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.2, length + 0.8]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
      </mesh>
      <mesh position={[width/2 + 0.2, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.2, length + 0.8]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.1, -length/2 - 0.2]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.8, 0.2, 0.4]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.1, length/2 + 0.2]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.8, 0.2, 0.4]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.75} />
      </mesh>
    </group>
  );
}

// ===== WATER CURTAIN =====
function WaterCurtain({ position = [0, 0, 0], width = 5, height = 4.5, poolY = 0.01 }) {
  const pointsRef = useRef();
  const count = 10000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * width;
      pos[i * 3 + 1] = Math.random();
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const curtainMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uHeight: { value: height },
      uPoolY: { value: poolY }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uHeight;
      uniform float uPoolY;
      varying float vAlpha;
      varying float vY;
      
      void main() {
        vec3 pos = position;
        
        float cycle = mod(uTime * 2.0, 1.0);
        float particleOffset = pos.y;
        float totalCycle = mod(cycle + particleOffset, 1.0);
        
        pos.y = uHeight - (totalCycle * (uHeight - uPoolY));
        
        pos.x += sin(uTime * 2.8 + particleOffset * 6.28) * 0.15;
        pos.z += cos(uTime * 2.2 + particleOffset * 6.28) * 0.1;
        
        vAlpha = smoothstep(0.0, 0.12, totalCycle) * smoothstep(1.0, 0.82, totalCycle);
        vY = pos.y;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 3.2 * (1.0 + totalCycle * 0.4);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying float vY;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        float alpha = (1.0 - dist * 2.0) * vAlpha;
        float brightness = 0.8 + vY * 0.06;
        
        gl_FragColor = vec4(brightness, brightness + 0.12, brightness + 0.18, alpha * 0.8);
      }
    `
  }), []);

  return (
    <points ref={pointsRef} position={position} material={curtainMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
    </points>
  );
}

// ===== KOI FISH =====
function Koi({ position = [0, 0, 0], count = 18, poolWidth = 7, poolLength = 13 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => 
    Array.from({ length: count }, () => ({
      offset: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.35,
      radiusX: (poolWidth / 2 - 0.6) * (0.4 + Math.random() * 0.6),
      radiusZ: (poolLength / 2 - 0.6) * (0.4 + Math.random() * 0.6),
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? 0 : 1
    }))
  , []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      data.forEach((fish, i) => {
        const angle = fish.offset + time * fish.speed;
        
        dummy.position.set(
          Math.cos(angle) * fish.radiusX,
          -0.55 + Math.sin(time * 2.2 + fish.phase) * 0.12,
          Math.sin(angle) * fish.radiusZ
        );
        dummy.rotation.y = angle + Math.PI / 2;
        dummy.scale.set(1, 1, 1 + Math.sin(time * 4.5 + fish.phase) * 0.25);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[null, null, count]} position={position}>
        <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
        <meshStandardMaterial color="#FF9F5A" roughness={0.35} metalness={0.25} />
      </instancedMesh>
    </>
  );
}

// ===== ENHANCED PLANT =====
function Plant({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Decorative pot */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.4, 16]} />
        <meshStandardMaterial color="#C9B89A" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#B0987A" roughness={0.8} />
      </mesh>
      
      {/* Soil */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#5A4A3A" roughness={0.95} />
      </mesh>
      
      {/* Palm-like leaves */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.12, 0.5, Math.sin(angle) * 0.12]} rotation={[0, angle, Math.PI / 3.5]}>
            <coneGeometry args={[0.15, 0.7, 8]} />
            <meshStandardMaterial color="#4A7C59" roughness={0.6} />
          </mesh>
        );
      })}
      
      {/* Center stem */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.25, 8]} />
        <meshStandardMaterial color="#6B8B5A" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ===== STAIRS WITH DETAIL =====
function Stairs({ position = [0, 0, 0], steps = 4 }) {
  return (
    <group position={position}>
      {Array.from({ length: steps }).map((_, i) => (
        <React.Fragment key={i}>
          <mesh position={[0, i * 0.18, i * 0.32]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 0.18, 0.38]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
          </mesh>
          {/* Step edge detail */}
          <mesh position={[0, i * 0.18 + 0.09, i * 0.32 + 0.2]} castShadow>
            <boxGeometry args={[3.8, 0.04, 0.08]} />
            <meshStandardMaterial color="#D4C4AC" roughness={0.75} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

// ===== BOUNDARY WALLS =====
function BoundaryWalls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 4, -18]} receiveShadow castShadow>
        <boxGeometry args={[45, 8, 1]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.85} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-22, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 8, 40]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.85} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[22, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 8, 40]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.85} />
      </mesh>
      
      {/* Wall decorative elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`wall-detail-${i}`} position={[0, 5, -17.8]} receiveShadow>
          <boxGeometry args={[4 + i * 0.5, 0.15, 0.15]} />
          <meshStandardMaterial color="#D4C4AC" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ===== FOUNTAIN CENTERPIECE =====
function Fountain({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.3, 20]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.75} />
      </mesh>
      
      {/* Lower basin */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.7, 0.25, 20]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.7} />
      </mesh>
      
      {/* Central column */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.5, 12]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.75} />
      </mesh>
      
      {/* Upper basin */}
      <mesh position={[0, 1.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.2, 16]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.7} />
      </mesh>
      
      {/* Decorative top */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#C9B89A" roughness={0.65} />
      </mesh>
    </group>
  );
}

// ===== DECORATIVE LANTERNS =====
function Lantern({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 3, 8]} />
        <meshStandardMaterial color="#4A3C2A" roughness={0.8} />
      </mesh>
      
      {/* Lantern body */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 6]} />
        <meshStandardMaterial color="#4A3C2A" roughness={0.7} />
      </mesh>
      
      {/* Glass/light */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.35, 6]} />
        <meshStandardMaterial 
          color="#FFF4E0" 
          emissive="#FFD9A0" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[0.22, 0.25, 6]} />
        <meshStandardMaterial color="#4A3C2A" roughness={0.75} />
      </mesh>
      
      {/* Point light */}
      <pointLight position={[0, 3.2, 0]} intensity={0.3} distance={4} color="#FFE4B5" />
    </group>
  );
}

// ===== SEATING AREA =====
function SeatingArea({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Bench base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.75} />
      </mesh>
      
      {/* Bench backrest */}
      <mesh position={[0, 0.7, -0.25]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 0.1]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.75} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.7, 0.15, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.15, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, 0.15, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.15, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#6B5033" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ===== CAMERA CONTROLLER =====
function CameraController({ cameraGroupRef }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (cameraGroupRef.current) {
      camera.position.lerp(cameraGroupRef.current.position, 0.1);
      camera.quaternion.slerp(
        new THREE.Quaternion().setFromEuler(cameraGroupRef.current.rotation),
        0.1
      );
    }
  });
  
  return null;
}

// ===== MAIN SCENE =====
function CourtyardScene({ cameraGroupRef }) {
  return (
    <>
      <CameraController cameraGroupRef={cameraGroupRef} />
      <VillaLighting />
      <fog attach="fog" args={['#F5EFE7', 25, 50]} />
      
      {/* Enhanced ground with pattern */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50, 20, 20]} />
        <meshStandardMaterial color="#F5EFE7" roughness={0.95} />
      </mesh>
      
      {/* Ground tile pattern */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`ground-line-${i}`} position={[(i - 4.5) * 4, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.08, 50]} />
          <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
        </mesh>
      ))}

      {/* Boundary walls */}
      <BoundaryWalls />

      {/* Left corridor with enhanced roof */}
      <Arcade position={[-6, 0, -4]} count={6} spacing={3.5} />
      <Pergola position={[-6, 5.8, 6.5]} width={4.5} length={21} slats={45} />

      {/* Right corridor with enhanced roof */}
      <Arcade position={[7.5, 0, 0]} count={5} spacing={3.5} />

      {/* Pool */}
      <Pool position={[0, 0, 2]} width={8} length={14} depth={1.2} />
      <Koi position={[0, 0, 2]} count={18} poolWidth={7} poolLength={13} />

      {/* Water curtain */}
      <WaterCurtain position={[-3.2, 2.5, -2]} width={5} height={5.2} poolY={0.01} />

      {/* Decorative fountain */}
      <Fountain position={[0, 0, -5]} />

      {/* Stairs */}
      <Stairs position={[8, 0, 12]} steps={4} />

      {/* Enhanced plants */}
      <Plant position={[-5, 0, -2]} scale={0.9} />
      <Plant position={[-5, 0, 4]} scale={1} />
      <Plant position={[-5, 0, 10]} scale={0.95} />
      <Plant position={[6.5, 0, 1]} scale={1} />
      <Plant position={[6.5, 0, 6]} scale={0.9} />
      <Plant position={[6.5, 0, 11]} scale={0.95} />
      <Plant position={[-2, 0, 10]} scale={0.85} />
      <Plant position={[2.5, 0, 10]} scale={0.9} />
      
      {/* Lanterns for ambiance */}
      <Lantern position={[-4, 0, -6]} />
      <Lantern position={[5, 0, -6]} />
      <Lantern position={[-4, 0, 14]} />
      <Lantern position={[5, 0, 14]} />
      
      {/* Seating areas */}
      <SeatingArea position={[-8, 0, 8]} />
      <SeatingArea position={[9, 0, 8]} />
    </>
  );
}

// ===== MAIN COMPONENT =====
export default function VillaJourney() {
  const sectionRef = useRef(null);
  const cameraGroupRef = useRef({ 
    position: new THREE.Vector3(0, 3, 18), 
    rotation: new THREE.Euler(0, 0, 0) 
  });
  const [dpr, setDpr] = useState(1.5);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      tl.to(cameraGroupRef.current.position, {
        x: -4,
        y: 3.2,
        z: 8,
        duration: 0.35
      })
      .to(cameraGroupRef.current.rotation, {
        y: 0.3,
        x: -0.05,
        duration: 0.35
      }, '<')
      .to(cameraGroupRef.current.position, {
        x: -1.5,
        y: 2.5,
        z: 3,
        duration: 0.35
      })
      .to(cameraGroupRef.current.rotation, {
        y: 0.45,
        x: -0.12,
        duration: 0.35
      }, '<')
      .to(cameraGroupRef.current.position, {
        x: 2,
        y: 2.8,
        z: 6,
        duration: 0.3
      })
      .to(cameraGroupRef.current.rotation, {
        y: -0.25,
        x: -0.08,
        duration: 0.3
      }, '<');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(to bottom, #FAF6F0 0%, #F5EFE7 50%, #F0E8DC 100%)'
      }}
    >
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 3, 18], fov: 55 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
          onDecline={() => setDpr(1)}
        />
        <CourtyardScene cameraGroupRef={cameraGroupRef} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '6%',
          maxWidth: '480px',
          color: '#2C2416',
          fontFamily: 'Georgia, serif',
          pointerEvents: 'none',
          background: 'rgba(255, 255, 255, 0.75)',
          padding: '2rem',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ 
          fontSize: '3.2rem', 
          marginBottom: '1.2rem', 
          fontWeight: 400,
          color: '#3D3020',
          letterSpacing: '0.01em',
          lineHeight: 1.2
        }}>
          Mediterranean Villa
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.8, 
          opacity: 0.9,
          color: '#4A3C2A',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          A timeless sanctuary where elegant archways embrace a crystalline pool, 
          cascading waters create a symphony of tranquility, and golden koi glide 
          beneath pergola shadows. Ancient pillars guard this oasis of serenity, 
          where every detail whispers Mediterranean elegance.
        </p>
      </div>
    </section>
  );
}