import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== REALISTIC WATER SHADER =====
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
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uCameraPos: { value: new THREE.Vector3() },
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

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod(v - floor(v * (1.0 / 289.0)) * 289.0, 289.0);
        vec4 p = mod(((mod(i.z + vec4(0.0, i1.z, i2.z, 1.0), 289.0) + 
          mod(i.y + vec4(0.0, i1.y, i2.y, 1.0), 289.0)) * 34.0 + 1.0) * 
          (mod(i.y + vec4(0.0, i1.y, i2.y, 1.0), 289.0) + 
          mod(i.x + vec4(0.0, i1.x, i2.x, 1.0), 289.0)), 289.0);
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vUv = uv;
        vPosition = position;
        vec3 pos = position;

        float wave1 = snoise(vec3(pos.x * 0.3 + uTime * 0.4, pos.z * 0.3, uTime * 0.2)) * 0.08;
        float wave2 = snoise(vec3(pos.x * 0.6 - uTime * 0.3, pos.z * 0.6, uTime * 0.15)) * 0.04;
        float wave3 = snoise(vec3(pos.x * 1.2 + uTime * 0.5, pos.z * 1.2, uTime * 0.25)) * 0.02;
        vElevation = wave1 + wave2 + wave3;
        pos.y += vElevation;

        float offset = 0.1;
        vec3 tangent1 = vec3(offset, snoise(vec3((pos.x + offset) * 0.3 + uTime * 0.4, pos.z * 0.3, uTime * 0.2)) * 0.08 - vElevation, 0.0);
        vec3 tangent2 = vec3(0.0, snoise(vec3(pos.x * 0.3 + uTime * 0.4, (pos.z + offset) * 0.3, uTime * 0.2)) * 0.08 - vElevation, offset);
        vNormal = normalize(cross(tangent1, tangent2));

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
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

      void main() {
        float depth = abs(vPosition.y);
        vec3 baseColor = mix(uShallowColor, uDeepColor, smoothstep(0.0, 5.0, depth));
        float caustic = (sin(vUv.x * 30.0 + uTime * 0.8) * 0.5 + 0.5) * (sin(vUv.y * 30.0 + uTime * 0.6) * 0.5 + 0.5) +
                       (sin(vUv.x * 20.0 - uTime * 0.5) * 0.5 + 0.5) * (sin(vUv.y * 20.0 + uTime * 0.7) * 0.5 + 0.5);
        vec3 color = baseColor + caustic * 0.075;
        vec3 viewDirection = normalize(uCameraPos - vPosition);
        float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);
        color = mix(color, uSurfaceColor, fresnel * 0.3);
        color += smoothstep(0.0, 3.0, depth) * 0.2;
        if (vElevation > 0.05) color = mix(color, uFoamColor, smoothstep(0.05, 0.08, vElevation) * 0.6);
        float alpha = min(0.85 + depth * 0.05, 0.95);
        gl_FragColor = vec4(color, alpha);
      }
    `
  }), []);

  return (
    <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={waterMaterial}>
      <planeGeometry args={[30, 40, 250, 300]} />
    </mesh>
  );
}

// ===== ANIMATED KOI FISH MODEL =====
function SwimmingKoi({ count = 25 }) {
  const groupRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const fishData = useMemo(() =>
    Array.from({ length: count }, () => ({
      startX: (Math.random() - 0.5) * 20,
      startY: -0.5 - Math.random() * 3,
      startZ: (Math.random() - 0.5) * 25,
      speed: 0.3 + Math.random() * 0.5,
      amplitude: 0.3 + Math.random() * 0.4,
      frequency: 1.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      pathOffset: Math.random() * Math.PI * 2,
      scale: 0.8 + Math.random() * 0.4
    })), [count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      fishData.forEach((fish, i) => {
        const pathProgress = (time * fish.speed + fish.pathOffset) % (Math.PI * 2);
        dummy.position.set(
          fish.startX + Math.sin(pathProgress) * 8,
          fish.startY + Math.sin(time * 0.8 + fish.phase) * fish.amplitude,
          fish.startZ + Math.cos(pathProgress) * 10
        );
        dummy.rotation.set(0, pathProgress + Math.PI / 2, Math.sin(time * fish.frequency + fish.phase) * 0.15);
        dummy.scale.set(fish.scale, fish.scale, fish.scale * (1 + Math.sin(time * 5 + fish.phase) * 0.15));
        dummy.updateMatrix();
        groupRef.current.children[i].children.forEach((part) => {
          part.matrix.copy(dummy.matrix);
          part.matrixAutoUpdate = false;
        });
      });
    }
  });

  return (
    <group ref={groupRef}>
      {fishData.map((_, i) => (
        <group key={i}>
          <mesh>
            <coneGeometry args={[0.15, 0.6, 8]} />
            <meshStandardMaterial color="#ff9f5a" roughness={0.3} metalness={0.2} emissive="#ff8040" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.1, 0.2, 3]} />
            <meshStandardMaterial color="#ff9f5a" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <coneGeometry args={[0.05, 0.15, 3]} />
            <meshStandardMaterial color="#ff9f5a" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[-0.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <coneGeometry args={[0.05, 0.15, 3]} />
            <meshStandardMaterial color="#ff9f5a" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ===== UNDERWATER PARTICLES =====
function UnderwaterParticles({ count = 5000 }) {
  const particlesRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 8 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const particleMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.x += sin(uTime * 0.5 + position.y * 0.5) * 0.3;
        pos.y += mod(uTime * 0.4 + position.y * 0.1, 8.0) - 4.0;
        pos.z += cos(uTime * 0.3 + position.x * 0.3) * 0.2;
        vAlpha = 0.3 + sin(uTime * 2.0 + position.x * 10.0) * 0.2;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 2.5 * (1.0 - mvPosition.z * 0.05);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vec4(0.8, 0.9, 1.0, (1.0 - dist * 2.0) * vAlpha * 0.4);
      }
    `
  }), []);

  return (
    <points ref={particlesRef} material={particleMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
    </points>
  );
}

// ===== POOL FLOOR AND WALLS =====
function PoolStructure() {
  const wallProps = { color: "#2d6a7a", roughness: 0.6 };
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[25, 35, 40, 50]} />
        <meshStandardMaterial color="#2a6a7a" roughness={0.7} metalness={0.1} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`tile-x-${i}`} position={[(i - 5.5) * 2, -3.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 35]} />
          <meshStandardMaterial color="#1a4a5a" roughness={0.8} />
        </mesh>
      ))}
      {Array.from({ length: 17 }).map((_, i) => (
        <mesh key={`tile-z-${i}`} position={[0, -3.99, (i - 8) * 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25, 0.05]} />
          <meshStandardMaterial color="#1a4a5a" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -3.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#3a8a9a" roughness={0.6} metalness={0.2} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`circle-${i}`} position={[Math.cos((i / 8) * Math.PI * 2) * 3, -3.97, Math.sin((i / 8) * Math.PI * 2) * 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 16]} />
          <meshStandardMaterial color="#4a9aaa" roughness={0.5} />
        </mesh>
      ))}
      <group>
        <mesh position={[-12, -2, 0]}><boxGeometry args={[0.5, 4, 35]} /><meshStandardMaterial {...wallProps} /></mesh>
        <mesh position={[12, -2, 0]}><boxGeometry args={[0.5, 4, 35]} /><meshStandardMaterial {...wallProps} /></mesh>
        <mesh position={[0, -2, -17]}><boxGeometry args={[25, 4, 0.5]} /><meshStandardMaterial {...wallProps} /></mesh>
        <mesh position={[0, -2, 17]}><boxGeometry args={[25, 4, 0.5]} /><meshStandardMaterial {...wallProps} /></mesh>
      </group>
    </group>
  );
}

// ===== UNDERWATER PLANTS =====
function UnderwaterPlant({ position = [0, 0, 0] }) {
  const plantRef = useRef();
  useFrame((state) => {
    if (plantRef.current) {
      plantRef.current.children.forEach((leaf, i) => {
        leaf.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + i * 0.5) * 0.2;
      });
    }
  });

  return (
    <group ref={plantRef} position={position}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, -4 + (0.6 + i * 0.15), 0]} rotation={[0, (i / 8) * Math.PI * 2, 0]}>
          <coneGeometry args={[0.08, (0.6 + i * 0.15) * 0.4, 8]} />
          <meshStandardMaterial color="#2d5a3a" roughness={0.7} transparent opacity={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 2, 8]} />
        <meshStandardMaterial color="#3d6a4a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ===== UNDERWATER ROCKS =====
function UnderwaterRocks() {
  const rocks = useMemo(() =>
    Array.from({ length: 15 }, () => ({
      position: [(Math.random() - 0.5) * 20, -3.8, (Math.random() - 0.5) * 30],
      scale: 0.3 + Math.random() * 0.5,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
    })), []);

  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.position} rotation={rock.rotation} scale={rock.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#4a5a5a" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ===== LIGHTING =====
function UnderwaterLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#5090a0" />
      <directionalLight position={[0, 10, 0]} intensity={0.8} color="#a0d8f0" castShadow />
      <pointLight position={[-8, -1, -10]} intensity={0.4} color="#60b0c0" distance={15} />
      <pointLight position={[8, -1, 10]} intensity={0.4} color="#60b0c0" distance={15} />
      <pointLight position={[0, -2, 0]} intensity={0.3} color="#70c0d0" distance={20} />
      <hemisphereLight args={['#80c8d8', '#2a5a6a', 0.4]} />
    </>
  );
}

// ===== CAMERA CONTROLLER =====
function DiveCameraController({ cameraGroupRef }) {
  const { camera } = useThree();
  useFrame(() => {
    if (cameraGroupRef.current) {
      camera.position.lerp(cameraGroupRef.current.position, 0.08);
      camera.quaternion.slerp(new THREE.Quaternion().setFromEuler(cameraGroupRef.current.rotation), 0.08);
    }
  });
  return null;
}

// ===== UNDERWATER SCENE =====
function UnderwaterScene({ cameraGroupRef }) {
  return (
    <>
      <DiveCameraController cameraGroupRef={cameraGroupRef} />
      <UnderwaterLighting />
      <fog attach="fog" args={['#2a6a7a', 5, 35]} />
      <RealisticWater />
      <PoolStructure />
      <SwimmingKoi count={25} />
      <UnderwaterParticles count={5000} />
      <UnderwaterRocks />
      {[[-8, 0, -8], [-6, 0, 5], [7, 0, -10], [9, 0, 8], [-10, 0, 12], [5, 0, -15], [-3, 0, -12], [10, 0, 15]].map((pos, i) => (
        <UnderwaterPlant key={i} position={pos} />
      ))}
    </>
  );
}

// ===== MAIN COMPONENT =====
export default function PoolDive() {
  const containerRef = useRef();
  const cameraGroupRef = useRef({ position: new THREE.Vector3(0, 0.2, 5), rotation: new THREE.Euler(-0.1, 0, 0) });
  const [dpr, setDpr] = useState(1.5);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });
      tl.to(cameraGroupRef.current.position, { x: 0, y: -0.3, z: 3, duration: 0.25 })
        .to(cameraGroupRef.current.rotation, { x: -0.05, duration: 0.25 }, '<')
        .to(cameraGroupRef.current.position, { x: 2, y: -1.2, z: 0, duration: 0.25 })
        .to(cameraGroupRef.current.rotation, { x: 0, y: 0.4, duration: 0.25 }, '<')
        .to(cameraGroupRef.current.position, { x: -3, y: -1.8, z: -4, duration: 0.25 })
        .to(cameraGroupRef.current.rotation, { x: 0.05, y: -0.5, duration: 0.25 }, '<')
        .to(cameraGroupRef.current.position, { x: 0, y: -2.8, z: 0, duration: 0.25 })
        .to(cameraGroupRef.current.rotation, { x: 0.2, y: 0, duration: 0.25 }, '<');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, #2a6a7a 0%, #1a4a5a 100%)' }}>
      <Canvas shadows dpr={dpr} camera={{ position: [0, 0.2, 5], fov: 60 }} style={{ width: '100%', height: '100%' }} gl={{ antialias: true, alpha: false }}>
        <AdaptiveDpr pixelated />
        <PerformanceMonitor onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))} onDecline={() => setDpr(1)} />
        <UnderwaterScene cameraGroupRef={cameraGroupRef} />
      </Canvas>
      <div style={{
        position: 'absolute', bottom: '8%', left: '6%', maxWidth: '480px', color: '#e0f5ff',
        fontFamily: 'Georgia, serif', pointerEvents: 'none', background: 'rgba(42, 106, 122, 0.6)',
        padding: '2rem', borderRadius: '8px', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 400, color: '#a0e8ff', letterSpacing: '0.01em', lineHeight: 1.2 }}>
          Dive Into Serenity
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.95, color: '#d0f0ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Descend into the crystalline depths where golden koi dance through 
          shimmering rays of sunlight. The underwater realm reveals its secrets—
          swaying aquatic gardens, ancient mosaic patterns, and the gentle rhythm 
          of life beneath the surface.
        </p>
      </div>
      <div style={{
        position: 'absolute', top: '5%', right: '5%', color: '#a0e8ff', fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '0.9rem', pointerEvents: 'none', background: 'rgba(42, 106, 122, 0.5)', padding: '1rem 1.5rem',
        borderRadius: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        🏊 Scroll to explore underwater
      </div>
    </div>
  );
}