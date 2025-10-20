import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import VillaJourney from './VillaJourney';

// ===== 3D Components =====
function BackgroundFade({ phase, gl }) {
  useEffect(() => {
    let color;
    if (phase === 'intro' || phase === 'exploding') {
      color = '#000000';
    } else {
      color = '#F5F0E6';
    }
    gl.setClearColor(new THREE.Color(color));
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

function PixelExplosion({ progressRef, count = 240 }) {
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
      {phase === 'exploding' && <PixelExplosion progressRef={explosion} count={240} />}
    </>
  );
}

// ===== Pixel Overlay Canvas Component =====
function PixelOverlay({ onComplete }) {
  const canvasRef = useRef(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const pixelGridRef = useRef([]);
  const mouseTrailRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const gridSize = 180;
    const pixelSize = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / pixelSize);
    const cols = Math.ceil(canvas.width / pixelSize);

    const pastelColors = [
      '#E8B4A8', '#C8B8DB', '#F5DEB3', '#A8B896', '#A8D5E2', '#6A4C93'
    ];

    pixelGridRef.current = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        pixelGridRef.current.push({
          x: j * pixelSize,
          y: i * pixelSize,
          size: pixelSize,
          color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
          opacity: 0.95,
          active: true,
          delay: Math.random() * 2000,
          blur: 20 + Math.random() * 15
        });
      }
    }

    setIsRevealing(true);
    startTimeRef.current = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const elapsed = Date.now() - startTimeRef.current;
      const autoDissolve = elapsed > 5000;

      let activeCount = 0;

      pixelGridRef.current.forEach((pixel) => {
        if (!pixel.active) return;

        if (autoDissolve) {
          const dissolveProgress = Math.min(1, (elapsed - 5000 - pixel.delay) / 1500);
          pixel.opacity = Math.max(0, 0.95 - dissolveProgress);
          if (pixel.opacity <= 0) {
            pixel.active = false;
            return;
          }
        }

        if (pixel.opacity > 0) {
          activeCount++;
          ctx.shadowBlur = pixel.blur;
          ctx.shadowColor = pixel.color;
          ctx.globalAlpha = pixel.opacity;
          ctx.fillStyle = pixel.color;
          ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        } else {
          pixel.active = false;
        }
      });

      mouseTrailRef.current.forEach((trail, idx) => {
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, trail.radius);
        gradient.addColorStop(0, `rgba(106, 76, 147, ${trail.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(106, 76, 147, ${trail.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(106, 76, 147, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        trail.radius += 3;
        trail.opacity -= 0.03;
        
        if (trail.opacity <= 0) {
          mouseTrailRef.current.splice(idx, 1);
        }
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (activeCount === 0) {
        onComplete();
      }
    };

    const animationFrame = setInterval(draw, 1000 / 60);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseTrailRef.current.push({
        x: mouseX,
        y: mouseY,
        radius: 30,
        opacity: 0.6
      });

      if (mouseTrailRef.current.length > 15) {
        mouseTrailRef.current.shift();
      }

      const removeRadius = 140;
      pixelGridRef.current.forEach((pixel) => {
        if (!pixel.active) return;
        
        const dx = pixel.x + pixel.size / 2 - mouseX;
        const dy = pixel.y + pixel.size / 2 - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < removeRadius) {
          const fadeSpeed = 0.25;
          const distanceFactor = (1 - distance / removeRadius);
          pixel.opacity -= fadeSpeed * distanceFactor * distanceFactor;
          if (pixel.opacity <= 0) {
            pixel.active = false;
          }
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(animationFrame);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair"
      style={{ zIndex: 10 }}
    />
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

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [active, sensitivity]);

  return { progress, anim, setProgress };
}

// ===== Main Hero Component =====
export default function Hero() {
  const [showPixelOverlay, setShowPixelOverlay] = useState(false);
  const [pixelComplete, setPixelComplete] = useState(false);
  const [isDayMode, setIsDayMode] = useState(true);
  const [zoomProgress, setZoomProgress] = useState(0);
  const [enableZoom, setEnableZoom] = useState(false);
  const { anim } = useHeroObserver({ active: !enableZoom, sensitivity: 0.0016, ease: 0.1 });

  const [phase, setPhase] = useState('intro');
  const explosion = useRef({ value: 0 });
  const scrollAccumulatorRef = useRef(0);

  useEffect(() => {
    if (!enableZoom) {
      document.body.classList.add('no-scroll');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('no-scroll');
      
      if (zoomProgress >= 1) {
        document.body.style.overflow = 'visible';
        document.documentElement.style.overflow = 'visible';
      } else {
        document.body.style.overflow = 'hidden';
      }
    }

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, [enableZoom, zoomProgress]);

  useEffect(() => {
    if (!enableZoom) return;

    const scrollThreshold = 1200;

    const handleWheel = (e) => {
      if (zoomProgress < 1) {
        e.preventDefault();
        
        // Only accumulate downward scrolls
        if (e.deltaY > 0) {
          scrollAccumulatorRef.current += e.deltaY;
        } else {
          // Allow scroll up but slower
          scrollAccumulatorRef.current += e.deltaY * 0.3;
        }
        
        // Clamp to prevent negative values
        scrollAccumulatorRef.current = Math.max(0, scrollAccumulatorRef.current);
        
        const newProgress = Math.min(1, scrollAccumulatorRef.current / scrollThreshold);
        setZoomProgress(newProgress);
      }
    };

    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        if (zoomProgress < 1) {
          e.preventDefault();
          const touchY = e.touches[0].clientY;
          const delta = touchStartY - touchY;
          
          if (delta > 0) {
            scrollAccumulatorRef.current += delta * 2;
          } else {
            scrollAccumulatorRef.current += delta * 0.5;
          }
          
          scrollAccumulatorRef.current = Math.max(0, scrollAccumulatorRef.current);
          
          const newProgress = Math.min(1, scrollAccumulatorRef.current / scrollThreshold);
          setZoomProgress(newProgress);
          touchStartY = touchY;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enableZoom, zoomProgress]);

  useEffect(() => {
    const p = anim || 0;

    if (p < 0.1) {
      setPhase('intro');
      explosion.current.value = 0;
    } else if (p < 0.35) {
      setPhase('exploding');
      explosion.current.value = Math.min(1, Math.max(0, (p - 0.1) / 0.25));
    } else {
      if (phase !== 'done') {
        setPhase('done');
        explosion.current.value = 1;
        setShowPixelOverlay(true);
      }
    }
  }, [anim, phase]);

  const handlePixelComplete = () => {
    setPixelComplete(true);
    setEnableZoom(true);
  };

  const scaleValue = 1 + zoomProgress * 2;
  const translateValue = -zoomProgress * 60;

  return (
    <section className="hero relative w-full h-screen" style={{ 
      margin: 0, 
      padding: 0,
      overflow: zoomProgress >= 1 ? 'visible' : 'hidden',
      minHeight: zoomProgress >= 1 ? 'auto' : '100vh'
    }}>
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow-x: hidden;
          }
          .hero {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
      
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          phase === 'done' ? 'opacity-0 pointer-events-none z-[0]' : 'opacity-100 z-[1]'
        }`}
      >
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

      <div
        className={`absolute inset-0 ${
          zoomProgress >= 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          transform: enableZoom 
            ? `scale(${scaleValue}) translateY(${translateValue}%)`
            : 'scale(1)',
          transformOrigin: '50% 30%',
          transition: zoomProgress >= 1 ? 'opacity 1s ease-out' : 'none',
          willChange: 'transform',
          margin: 0,
          padding: 0,
        }}
      >
        <div className="relative w-full h-full" style={{ margin: 0, padding: 0 }}>
          <button
            onClick={() => setIsDayMode(!isDayMode)}
            className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 border border-white/30"
            style={{ opacity: pixelComplete ? 1 : 0, pointerEvents: pixelComplete ? 'auto' : 'none' }}
          >
            <span className="text-lg">{isDayMode ? '🌙' : '☀️'}</span>
            <span>{isDayMode ? 'Night' : 'Day'}</span>
          </button>

          <img
            src="/textures/villaDay.jpg"
            alt="Villa Day View"
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ opacity: isDayMode ? 1 : 0, transition: 'opacity 0.5s ease-out', margin: 0, padding: 0 }}
          />

          <img
            src="/textures/villaNight.jpg"
            alt="Villa Night View"
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ opacity: !isDayMode ? 1 : 0, transition: 'opacity 0.5s ease-out', margin: 0, padding: 0 }}
          />

          {showPixelOverlay && !pixelComplete && (
            <PixelOverlay onComplete={handlePixelComplete} />
          )}
        </div>
      </div>

      <div
        className={`${zoomProgress >= 1 ? 'relative' : 'absolute inset-0'} transition-opacity duration-1000 ${
          zoomProgress >= 1 ? 'opacity-100 z-[3] pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ margin: 0, padding: 0 }}
      >
        <VillaJourney />
      </div>

      {showPixelOverlay && !pixelComplete && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[20] text-white text-center">
          <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full animate-pulse">
            Move your cursor to reveal the villa ✨
          </div>
        </div>
      )}

      {pixelComplete && zoomProgress < 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[20] text-white text-center">
          <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full animate-bounce">
            Scroll to zoom into the villa gate 🏛️
          </div>
        </div>
      )}

      {!showPixelOverlay && !pixelComplete && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[3] text-white text-sm animate-bounce">
          Scroll to explore
        </div>
      )}
    </section>
  );
}