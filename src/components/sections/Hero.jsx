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