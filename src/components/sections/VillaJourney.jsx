import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== LIGHTING =====
function VillaLighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#FFF4E0" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.3}
        color="#FFD9A0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 15, -8]} intensity={0.4} color="#B8A080" />
      <hemisphereLight args={['#FFF8E7', '#C9B89A', 0.3]} />
    </>
  );
}

// ===== ELEGANT ARCH WITH DEPTH =====
function Arch({ position = [0, 0, 0], width = 2.8, height = 4.5, depth = 0.8 }) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh castShadow receiveShadow position={[-width/2, height/2, 0]}>
        <boxGeometry args={[0.5, height, depth]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      
      {/* Right pillar */}
      <mesh castShadow receiveShadow position={[width/2, height/2, 0]}>
        <boxGeometry args={[0.5, height, depth]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      
      {/* Arch curve */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 15) * Math.PI;
        const x = Math.cos(angle) * (width / 2);
        const y = height + Math.sin(angle) * (width / 2);
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, -angle]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.25, depth]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
          </mesh>
        );
      })}
      
      {/* Inner arch depth */}
      <mesh position={[0, height/2, -depth/4]} receiveShadow>
        <boxGeometry args={[width, height, depth/2]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ===== ARCADE CORRIDOR WITH ROOF =====
function Arcade({ position = [0, 0, 0], count = 5, spacing = 3.5 }) {
  const totalLength = count * spacing;
  
  return (
    <group position={position}>
      {/* Back wall */}
      <mesh position={[0, 3, -0.5]} receiveShadow>
        <boxGeometry args={[1, 6, totalLength]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.85} />
      </mesh>
      
      {/* Floor */}
      <mesh position={[0, 0, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, totalLength]} />
        <meshStandardMaterial color="#EFE6D5" roughness={0.9} />
      </mesh>
      
      {/* ROOF - Flat with slight overhang */}
      <mesh position={[0, 6.2, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[5, totalLength + 0.5]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.85} />
      </mesh>
      
      {/* Roof edge detail */}
      <mesh position={[2.5, 6.1, totalLength / 2 - spacing / 2]} castShadow>
        <boxGeometry args={[0.2, 0.25, totalLength + 0.5]} />
        <meshStandardMaterial color="#C9B89A" roughness={0.8} />
      </mesh>
      <mesh position={[-2.5, 6.1, totalLength / 2 - spacing / 2]} castShadow>
        <boxGeometry args={[0.2, 0.25, totalLength + 0.5]} />
        <meshStandardMaterial color="#C9B89A" roughness={0.8} />
      </mesh>
      
      {/* Arches */}
      {Array.from({ length: count }).map((_, i) => (
        <Arch key={i} position={[0, 0, i * spacing]} width={2.8} height={4.5} depth={0.8} />
      ))}
    </group>
  );
}

// ===== PERGOLA WITH PROPER SLATS =====
function Pergola({ position = [0, 0, 0], width = 4, length = 18, slats = 35 }) {
  return (
    <group position={position}>
      {/* Main beams */}
      <mesh position={[-width/2, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, length]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      <mesh position={[width/2, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, length]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.7} />
      </mesh>
      
      {/* Cross slats */}
      {Array.from({ length: slats }).map((_, i) => (
        <mesh key={i} position={[0, 0.1, (i / slats - 0.5) * length]} castShadow>
          <boxGeometry args={[width + 0.3, 0.08, 0.08]} />
          <meshStandardMaterial color="#A0826D" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ===== POOL WITH PROPER WATER =====
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
      uShallowColor: { value: new THREE.Color('#4FA5B8') },
      uFoamColor: { value: new THREE.Color('#87CEEB') }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vPos;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Gentle ripples
        pos.z += sin(pos.x * 3.0 + uTime * 0.8) * 0.025;
        pos.z += cos(pos.y * 2.5 + uTime * 0.6) * 0.02;
        pos.z += sin(pos.x * 1.5 + pos.y * 1.2 + uTime) * 0.015;
        
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
        // Depth gradient from center
        float depth = length(vUv - 0.5) * 1.4;
        vec3 color = mix(uShallowColor, uDeepColor, depth);
        
        // Caustics effect - MORE VISIBLE
        float caustic = sin(vUv.x * 20.0 + uTime * 0.5) * 0.5 + 0.5;
        caustic *= sin(vUv.y * 20.0 + uTime * 0.7) * 0.5 + 0.5;
        color += caustic * 0.15;
        
        // Edge foam
        float edgeDistance = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        float foam = smoothstep(0.0, 0.05, edgeDistance);
        color = mix(uFoamColor, color, foam);
        
        gl_FragColor = vec4(color, 0.88);
      }
    `
  }), []);

  return (
    <group position={position}>
      {/* Pool floor with tile pattern */}
      <mesh position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length, 40, 60]} />
        <meshStandardMaterial 
          color="#3A8A9A" 
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Pool walls */}
      <mesh position={[-width/2, -depth/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.15, depth, length]} />
        <meshStandardMaterial color="#2D6A7A" roughness={0.5} />
      </mesh>
      <mesh position={[width/2, -depth/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.15, depth, length]} />
        <meshStandardMaterial color="#2D6A7A" roughness={0.5} />
      </mesh>
      <mesh position={[0, -depth/2, -length/2]} receiveShadow castShadow>
        <boxGeometry args={[width, depth, 0.15]} />
        <meshStandardMaterial color="#2D6A7A" roughness={0.5} />
      </mesh>
      <mesh position={[0, -depth/2, length/2]} receiveShadow castShadow>
        <boxGeometry args={[width, depth, 0.15]} />
        <meshStandardMaterial color="#2D6A7A" roughness={0.5} />
      </mesh>
      
      {/* Water surface - COMPLETE FULL COVERAGE */}
      <mesh 
        ref={waterRef} 
        position={[0, 0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        material={waterMaterial}
      >
        <planeGeometry args={[width, length, 150, 200]} />
      </mesh>
      
      {/* Pool edge/coping */}
      <mesh position={[-width/2 - 0.15, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.15, length + 0.6]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      <mesh position={[width/2 + 0.15, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.15, length + 0.6]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, -length/2 - 0.15]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.6, 0.15, 0.3]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, length/2 + 0.15]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.6, 0.15, 0.3]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ===== WATER CURTAIN - FALLING DOWN =====
function WaterCurtain({ position = [0, 0, 0], width = 5, height = 4.5, poolY = 0.01 }) {
  const pointsRef = useRef();
  const count = 8000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * width; // x
      pos[i * 3 + 1] = Math.random(); // y (0-1, will be scaled)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3; // z
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
        
        // Fall from top to bottom (pool level)
        float cycle = mod(uTime * 1.8, 1.0);
        float particleOffset = pos.y; // 0-1 range
        float totalCycle = mod(cycle + particleOffset, 1.0);
        
        // Start at top, fall to pool level
        pos.y = uHeight - (totalCycle * (uHeight - uPoolY));
        
        // Slight horizontal sway
        pos.x += sin(uTime * 2.5 + particleOffset * 6.28) * 0.12;
        pos.z += cos(uTime * 2.0 + particleOffset * 6.28) * 0.08;
        
        // Fade in/out
        vAlpha = smoothstep(0.0, 0.1, totalCycle) * smoothstep(1.0, 0.85, totalCycle);
        vY = pos.y;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 2.8 * (1.0 + totalCycle * 0.3);
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
        
        // Brighter at top, slightly more transparent at bottom
        float brightness = 0.75 + vY * 0.05;
        
        gl_FragColor = vec4(brightness, brightness + 0.1, brightness + 0.15, alpha * 0.75);
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
function Koi({ position = [0, 0, 0], count = 15, poolWidth = 7, poolLength = 13 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => 
    Array.from({ length: count }, () => ({
      offset: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.3,
      radiusX: (poolWidth / 2 - 0.5) * (0.5 + Math.random() * 0.5),
      radiusZ: (poolLength / 2 - 0.5) * (0.5 + Math.random() * 0.5),
      phase: Math.random() * Math.PI * 2
    }))
  , []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      data.forEach((fish, i) => {
        const angle = fish.offset + time * fish.speed;
        
        dummy.position.set(
          Math.cos(angle) * fish.radiusX,
          -0.6 + Math.sin(time * 2 + fish.phase) * 0.1,
          Math.sin(angle) * fish.radiusZ
        );
        dummy.rotation.y = angle + Math.PI / 2;
        dummy.scale.set(1, 1, 1 + Math.sin(time * 4 + fish.phase) * 0.2);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} position={position}>
      <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
      <meshStandardMaterial color="#FF9F5A" roughness={0.4} metalness={0.2} />
    </instancedMesh>
  );
}

// ===== PLANT =====
function Plant({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#C9B89A" roughness={0.8} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.1, 0.4, Math.sin(angle) * 0.1]} rotation={[0, angle, Math.PI / 4]}>
            <coneGeometry args={[0.12, 0.6, 8]} />
            <meshStandardMaterial color="#4A7C59" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

// ===== STAIRS =====
function Stairs({ position = [0, 0, 0], steps = 4 }) {
  return (
    <group position={position}>
      {Array.from({ length: steps }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.18, i * 0.32]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.18, 0.35]} />
          <meshStandardMaterial color="#E8DCC8" roughness={0.85} />
        </mesh>
      ))}
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
      <fog attach="fog" args={['#F5EFE7', 20, 45]} />
      
      {/* Ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#EFE6D5" roughness={0.95} />
      </mesh>

      {/* Left corridor with roof */}
      <Arcade position={[-6, 0, -4]} count={6} spacing={3.5} />
      <Pergola position={[-6, 5.8, 6.5]} width={4} length={21} slats={40} />

      {/* Right corridor with roof */}
      <Arcade position={[7.5, 0, 0]} count={5} spacing={3.5} />

      {/* Pool */}
      <Pool position={[0, 0, 2]} width={8} length={14} depth={1.2} />
      <Koi position={[0, 0, 2]} count={15} poolWidth={7} poolLength={13} />

      {/* Water curtain - falling DIRECTLY INTO the pool surface */}
      <WaterCurtain position={[-3.2, 2.5, -2]} width={5} height={5.2} poolY={0.01} />

      {/* Stairs */}
      <Stairs position={[8, 0, 12]} steps={4} />

      {/* Plants */}
      <Plant position={[-5, 0, -2]} scale={0.8} />
      <Plant position={[-5, 0, 4]} scale={0.9} />
      <Plant position={[-5, 0, 10]} scale={0.85} />
      <Plant position={[6.5, 0, 1]} scale={0.9} />
      <Plant position={[6.5, 0, 6]} scale={0.8} />
      <Plant position={[6.5, 0, 11]} scale={0.85} />
    </>
  );
}

// ===== MAIN COMPONENT =====
export default function VillaJourney() {
  const sectionRef = useRef(null);
  const cameraGroupRef = useRef({ 
    position: new THREE.Vector3(0, 2.5, 16), 
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
        x: -3,
        y: 2.8,
        z: 6,
        duration: 0.35
      })
      .to(cameraGroupRef.current.rotation, {
        y: 0.25,
        duration: 0.35
      }, '<')
      .to(cameraGroupRef.current.position, {
        x: -1,
        y: 2.2,
        z: 2,
        duration: 0.35
      })
      .to(cameraGroupRef.current.rotation, {
        y: 0.4,
        x: -0.1,
        duration: 0.35
      }, '<')
      .to(cameraGroupRef.current.rotation, {
        y: -0.3,
        duration: 0.3
      });
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
        backgroundColor: '#F5EFE7'
      }}
    >
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 2.5, 16], fov: 55 }}
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
          maxWidth: '450px',
          color: '#2C2416',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          pointerEvents: 'none'
        }}
      >
        <h2 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem', 
          fontWeight: 300,
          color: '#3D3020',
          letterSpacing: '0.02em'
        }}>
          Villa Courtyard
        </h2>
        <p style={{ 
          fontSize: '1.05rem', 
          lineHeight: 1.7, 
          opacity: 0.85,
          color: '#4A3C2A'
        }}>
          A serene sanctuary where rhythmic arches frame tranquil waters, 
          cascading curtains dance in eternal grace, and golden koi trace 
          endless circles beneath the dappled pergola shade.
        </p>
      </div>
    </section>
  );
}