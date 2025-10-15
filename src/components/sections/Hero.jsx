import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';

// ===== 3D Components =====
function BackgroundFade({ phase, gl }) {
  useEffect(() => {
    const from = new THREE.Color('#000000');
    const to = new THREE.Color(phase === 'intro' ? '#000000' : '#F5F0E6');
    const tmp = { t: 0 };
    
    let anim;
    const updateColor = () => {
      gl.setClearColor(from.clone().lerp(to, tmp.t));
    };
    
    anim = requestAnimationFrame(function animate() {
      if (tmp.t < 1) {
        tmp.t = Math.min(1, tmp.t + 0.025);
        updateColor();
        anim = requestAnimationFrame(animate);
      }
    });
    
    return () => cancelAnimationFrame(anim);
  }, [phase, gl]);
  
  return null;
}

// ===== Animated Particle Background =====
function ParticleBackground() {
  const pointsRef = useRef();
  const count = 800;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      });
    }
    
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Floating animation
      positions[i3] += particles.velocities[i].x;
      positions[i3 + 1] += particles.velocities[i].y;
      positions[i3 + 2] += particles.velocities[i].z;
      
      // Wave effect
      positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.003;
      
      // Boundary wrapping
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -0.95;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -0.95;
      if (Math.abs(positions[i3 + 2]) > 7) positions[i3 + 2] *= -0.95;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8B7FBD"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ===== Geometric Lines Background =====
function GeometricLines() {
  const linesRef = useRef();
  const lineCount = 60;

  const lineData = useMemo(() => {
    const positions = [];
    
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius = 8 + Math.random() * 4;
      const z = (Math.random() - 0.5) * 10;
      
      // Create line from center outward
      positions.push(0, 0, 0);
      positions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        z
      );
    }
    
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    if (!linesRef.current) {
      return;
    }
    const time = state.clock.elapsedTime;
    linesRef.current.rotation.z = time * 0.1;
    linesRef.current.rotation.y = time * 0.05;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount * 2}
          array={lineData}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#6A4C93"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// ===== Orbiting Rings =====
function OrbitingRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3;
      ring1Ref.current.rotation.y = time * 0.2;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = time * -0.25;
      ring2Ref.current.rotation.z = time * 0.15;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.35;
      ring3Ref.current.rotation.z = time * -0.2;
    }
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#6A4C93" transparent opacity={0.3} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#8B7FBD" transparent opacity={0.25} />
      </mesh>
      
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#A899D8" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ===== Floating Spheres =====
function FloatingSpheres() {
  const spheresRef = useRef();
  const count = 12;

  const sphereData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 6 + Math.random() * 2;
      data.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 8,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!spheresRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    sphereData.forEach((sphere, i) => {
      dummy.position.set(
        sphere.x + Math.sin(time * sphere.speed + sphere.phase) * 0.5,
        sphere.y + Math.cos(time * sphere.speed + sphere.phase) * 0.5,
        sphere.z + Math.sin(time * 0.3 + sphere.phase) * 0.3
      );
      dummy.scale.setScalar(0.15 + Math.sin(time * 2 + sphere.phase) * 0.05);
      dummy.updateMatrix();
      spheresRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    spheresRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={spheresRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color="#8B7FBD"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function PixelCube() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    const s = 1 + Math.sin(t * 2) * 0.08;
    ref.current.scale.set(s, s, s);
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = Math.sin(t * 1.4) * 0.25;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial 
        color="#6A4C93" 
        emissive="#6A4C93" 
        emissiveIntensity={0.35} 
        roughness={0.4} 
        metalness={0.1}
      />
    </mesh>
  );
}

function PixelTransition({ progressRef, count = 240 }) {
  const meshRef = useRef();
  const sp = useRef(0);

  const seeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      const dist = 3 + Math.random() * 3;
      const rot = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const seed = Math.random() * Math.PI * 2;
      arr.push({ dir, dist, rot, seed });
    }
    return arr;
  }, [count]);

  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const scl = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const raw = progressRef.current.value || 0;
    const smooth = Math.min(1, Math.max(0, raw));
    const ease = 3 * smooth * smooth - 2 * smooth * smooth * smooth;
    sp.current += (ease - sp.current) * 0.08;

    const t = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const { dir, dist, rot, seed } = seeds[i];
      pos.copy(dir).multiplyScalar(dist * sp.current);

      const floatAmt = 0.14 * Math.min(1, Math.max(0, sp.current - 0.85) / 0.15);
      if (floatAmt > 0) {
        pos.x += Math.sin(t * 0.6 + seed) * floatAmt * 0.35;
        pos.y += Math.cos(t * 0.7 + seed * 1.3) * floatAmt * 0.45;
        pos.z += Math.sin(t * 0.5 + seed * 0.7) * floatAmt * 0.3;
      }

      const s = 0.26 * (1 - 0.28 * sp.current);
      scl.set(s, s, s);

      const rx = rot.x * sp.current + floatAmt * 0.3 * Math.sin(t * 0.4 + seed);
      const ry = rot.y * sp.current + floatAmt * 0.35 * Math.cos(t * 0.45 + seed * 0.6);
      const rz = rot.z * sp.current + floatAmt * 0.25 * Math.sin(t * 0.38 + seed * 1.2);
      quat.setFromEuler(new THREE.Euler(rx, ry, rz));

      m4.compose(pos, quat, scl);
      meshRef.current.setMatrixAt(i, m4);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#6A4C93"
        emissive="#6A4C93"
        emissiveIntensity={1.4}
        roughness={0.6}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function VillaLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[7, 10, 6]} 
        intensity={1.15} 
        color="#FFB75D" 
        castShadow 
      />
      <directionalLight 
        position={[-7, 6, -3]} 
        intensity={0.35} 
        color="#6A4C93" 
      />
    </>
  );
}

function Scene3DContent({ phase, explosion }) {
  const { gl } = useThree();
  return (
    <>
      <BackgroundFade phase={phase} gl={gl} />
      <VillaLighting />
      
      {/* Animated backgrounds only visible in intro phase */}
      {phase === 'intro' && (
        <>
          <ParticleBackground />
          <GeometricLines />
          <OrbitingRings />
          <FloatingSpheres />
        </>
      )}
      
      {phase === 'intro' && <PixelCube />}
      {phase === 'exploding' && <PixelTransition progressRef={explosion} count={240} />}
    </>
  );
}

// ===== Hook for scroll observer =====
function useHeroObserver({ active = true, sensitivity = 0.0016, ease = 0.1 } = {}) {
  const [progress, setProgress] = useState(0);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    let animId;
    const tick = () => {
      setAnim((prev) => {
        const next = prev + (progress - prev) * ease;
        return Math.abs(next - prev) > 0.0001 ? next : prev;
      });
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [progress, ease]);

  useEffect(() => {
    if (!active) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setProgress((p) => Math.min(1, Math.max(0, p + e.deltaY * sensitivity)));
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setProgress((p) => Math.min(1, Math.max(0, p + touch.clientY * sensitivity)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [active, sensitivity]);

  return { progress, anim, setProgress };
}

// ===== Main Hero Component =====
export default function Hero() {
  const [done, setDone] = useState(false);
  const [isDayMode, setIsDayMode] = useState(true);
  const { anim } = useHeroObserver({ active: !done, sensitivity: 0.0016, ease: 0.1 });

  const [phase, setPhase] = useState('intro');
  const explosion = useRef({ value: 0 });

  useEffect(() => {
    if (!done) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [done]);

  useEffect(() => {
    const p = anim || 0;

    if (p < 0.1) {
      setPhase('intro');
      explosion.current.value = 0;
    } else if (p < 0.3) {
      setPhase('exploding');
      explosion.current.value = Math.min(1, Math.max(0, (p - 0.1) / 0.2));
    } else {
      setPhase('done');
      explosion.current.value = 1;

      if (!done) {
        setDone(true);
        const next = document.querySelector('#villa-journey');
        if (next) {
          setTimeout(() => {
            next.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  }, [anim, done]);

  return (
    <section className="hero relative w-full min-h-screen overflow-hidden bg-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-[1]">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
          eventSource={document.body}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <Scene3DContent phase={phase} explosion={explosion} />
          </Suspense>
        </Canvas>
      </div>

      {/* Villa Image Section */}
      <div
        className={`absolute inset-0 z-[2] transition-opacity duration-500 ${
          phase === 'done' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative w-full h-full">
          {/* Toggle Button */}
          <button
            onClick={() => setIsDayMode(!isDayMode)}
            className="absolute top-8 left-8 z-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 border border-white/30"
          >
            <span className="text-lg">{isDayMode ? '🌙' : '☀️'}</span>
            <span>{isDayMode ? 'Night' : 'Day'}</span>
          </button>

          {/* Day View Image */}
          <img
            src="/textures/villaDay.jpg"
            alt="Villa Day View"
            className={`w-full h-full bg-center bg-cover bg-no-repeat transition-opacity duration-500 ${
              isDayMode ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Night View Image */}
          <img
            src="/textures/villaNight.jpg"
            alt="Villa Night View"
            className={`absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transition-opacity duration-500 ${
              !isDayMode ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </section>
  );
}