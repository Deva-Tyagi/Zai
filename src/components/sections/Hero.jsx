import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import VillaJourney from './VillaJourney';

// ===== Spiral Cubes Animation Component =====
function SpiralCubes({ onComplete }) {
  const groupRef = useRef();
  const smokeRef = useRef();
  const [cubes] = useState(() => {
    const cubeData = [];
    const gridSize = 24;
    let x = 0, y = 0;
    let dx = 0, dy = -1;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      cubeData.push({
        position: [x * 0.8, y * 0.8, 0],
        delay: i * 0.012,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
      });
      
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
        [dx, dy] = [-dy, dx];
      }
      x += dx;
      y += dy;
    }
    
    return cubeData;
  });

  const timelineRef = useRef({ progress: 0, phase: 'growing' });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const tl = timelineRef.current;
    const totalDuration = 7;
    const growDuration = 4.5;
    const holdDuration = 0.5;
    const fadeDuration = 2;
    
    tl.progress += delta;
    
    groupRef.current.children.forEach((cubeGroup, i) => {
      const cubeDelay = cubes[i].delay;
      const localTime = Math.max(0, tl.progress - cubeDelay);
      
      const mainCube = cubeGroup.children[0];
      const borderCube = cubeGroup.children[1];
      const smokeParticle = cubeGroup.children[2];
      
      // Growing phase
      if (localTime < 0.4) {
        const growProgress = localTime / 0.4;
        const eased = growProgress < 0.5 
          ? 4 * growProgress * growProgress * growProgress
          : 1 - Math.pow(-2 * growProgress + 2, 3) / 2;
        
        mainCube.scale.setScalar(eased * 1.2);
        borderCube.scale.setScalar(eased * 1.2);
        smokeParticle.scale.setScalar(0);
        
        mainCube.material.opacity = eased;
        borderCube.material.opacity = eased * 0.8;
        smokeParticle.material.opacity = 0;
      } 
      // Hold phase
      else if (tl.progress < growDuration + holdDuration) {
        mainCube.scale.setScalar(1.2);
        borderCube.scale.setScalar(1.2);
        smokeParticle.scale.setScalar(0);
        
        mainCube.material.opacity = 1;
        borderCube.material.opacity = 0.8;
        smokeParticle.material.opacity = 0;
      }
      // Fade out phase - cubes evaporate into smoke
      else if (tl.progress < totalDuration) {
        const fadeProgress = (tl.progress - growDuration - holdDuration) / fadeDuration;
        const fadeOut = 1 - fadeProgress;
        const smokeIn = fadeProgress;
        
        // Cubes fade out
        mainCube.material.opacity = fadeOut;
        borderCube.material.opacity = fadeOut * 0.8;
        mainCube.scale.setScalar((1.2 - fadeProgress * 0.4));
        borderCube.scale.setScalar((1.2 - fadeProgress * 0.4));
        
        // Smoke particles appear and expand
        smokeParticle.scale.setScalar(smokeIn * 2);
        smokeParticle.material.opacity = smokeIn * 0.4 * fadeOut;
        smokeParticle.position.y += delta * 0.5; // Rise up effect
      }
      
      // Continuous rotation
      mainCube.rotation.x += 0.003;
      mainCube.rotation.y += 0.004;
      borderCube.rotation.x += 0.003;
      borderCube.rotation.y += 0.004;
      smokeParticle.rotation.x += 0.002;
      smokeParticle.rotation.y += 0.003;
    });
    
    // Full screen smoky overlay - appears as cubes evaporate
    if (smokeRef.current) {
      if (tl.progress > growDuration + holdDuration) {
        const smokeProgress = Math.min(1, (tl.progress - growDuration - holdDuration) / fadeDuration);
        smokeRef.current.material.opacity = smokeProgress * 0.25;
        smokeRef.current.rotation.z += 0.0005;
      }
    }
    
    // Call onComplete when animation finishes
    if (tl.progress >= totalDuration && onComplete && !tl.completed) {
      tl.completed = true;
      setTimeout(onComplete, 100);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {cubes.map((cube, i) => (
          <group key={i} position={cube.position}>
            {/* Main cube */}
            <mesh rotation={cube.rotation}>
              <boxGeometry args={[0.35, 0.35, 0.35]} />
              <meshStandardMaterial
                color="#6A4C93"
                emissive="#6A4C93"
                emissiveIntensity={0.6}
                transparent
                opacity={0}
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
            {/* Border cube - slightly larger for 1px border effect */}
            <mesh rotation={cube.rotation}>
              <boxGeometry args={[0.37, 0.37, 0.37]} />
              <meshBasicMaterial
                color="#FFFFFF"
                transparent
                opacity={0}
                side={THREE.BackSide}
              />
            </mesh>
            {/* Smoke particle - appears when cube evaporates */}
            <mesh rotation={cube.rotation}>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshBasicMaterial
                color="#8B6BBD"
                transparent
                opacity={0}
              />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Full screen smoky overlay - purple haze */}
      <mesh ref={smokeRef} position={[0, 0, -1]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial
          color="#6A4C93"
          transparent
          opacity={0}
        />
      </mesh>
    </>
  );
}

// ===== 3D Components =====
function BackgroundFade({ phase, gl }) {
  useEffect(() => {
    let color;
    if (phase === 'intro') {
      color = '#FFFFFF';
    } else {
      color = '#F5F0E6';
    }
    gl.setClearColor(new THREE.Color(color));
  }, [phase, gl]);
  
  return null;
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

function Scene3DContent({ phase, onSpiralComplete }) {
  const { gl } = useThree();
  return (
    <>
      <BackgroundFade phase={phase} gl={gl} />
      <VillaLighting />
      {phase === 'intro' && <SpiralCubes onComplete={onSpiralComplete} />}
    </>
  );
}

// ===== Main Hero Component =====
export default function Hero() {
  const [isDayMode, setIsDayMode] = useState(true);
  const [zoomProgress, setZoomProgress] = useState(0);
  const [enableZoom, setEnableZoom] = useState(false);

  const [phase, setPhase] = useState('intro');
  const scrollAccumulatorRef = useRef(0);
  const spiralCompletedRef = useRef(false);

  const handleSpiralComplete = () => {
    if (!spiralCompletedRef.current) {
      spiralCompletedRef.current = true;
      setTimeout(() => {
        setPhase('villa');
        setEnableZoom(true);
      }, 200);
    }
  };

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
        
        if (e.deltaY > 0) {
          scrollAccumulatorRef.current += e.deltaY;
        } else {
          scrollAccumulatorRef.current += e.deltaY * 0.3;
        }
        
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

  const scaleValue = 1 + zoomProgress * 2;
  const translateValue = -zoomProgress * 60;
  const villaOpacity = 1 - Math.min(1, Math.max(0, (zoomProgress - 0.7) / 0.3));

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
      
      {/* 3D Canvas - Only visible during intro */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          phase === 'intro' ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none z-[0]'
        }`}
      >
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 90 }}
          gl={{ antialias: true, alpha: false }}
          eventSource={document.body}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <Scene3DContent 
              phase={phase} 
              onSpiralComplete={handleSpiralComplete}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Villa Images */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          phase === 'intro' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          transform: enableZoom 
            ? `scale(${scaleValue}) translateY(${translateValue}%)`
            : 'scale(1)',
          transformOrigin: '50% 30%',
          willChange: 'transform, opacity',
          margin: 0,
          padding: 0,
          pointerEvents: zoomProgress >= 1 ? 'none' : 'auto',
          opacity: villaOpacity,
        }}
      >
        <div className="relative w-full h-full" style={{ margin: 0, padding: 0 }}>
          <img
            src="/textures/villaDay.jpg"
            alt="Villa Day View"
            className="w-full h-full object-cover"
            style={{ opacity: isDayMode ? 1 : 0, transition: 'opacity 0.5s ease-out', margin: 0, padding: 0 }}
          />

          <img
            src="/textures/villaNight.jpg"
            alt="Villa Night View"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: !isDayMode ? 1 : 0, transition: 'opacity 0.5s ease-out', margin: 0, padding: 0 }}
          />
        </div>
      </div>
      
      {/* Day/Night Toggle Button */}
      <button
        onClick={() => setIsDayMode(!isDayMode)}
        className={`fixed top-4 left-4 z-[50] bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 border border-white/30 cursor-pointer ${
          zoomProgress >= 1 || phase === 'intro' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <span className="text-lg">{isDayMode ? '🌙' : '☀️'}</span>
        <span>{isDayMode ? 'Night' : 'Day'}</span>
      </button>

      {/* Villa Journey Component */}
      <div
        className={`${zoomProgress >= 1 ? 'relative' : 'absolute inset-0'} transition-opacity duration-1000 ${
          zoomProgress >= 1 ? 'opacity-100 z-[3] pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ margin: 0, padding: 0 }}
      >
        <VillaJourney />
      </div>

      {/* Scroll Prompt */}
      {phase === 'villa' && zoomProgress < 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[20] text-white text-center">
          <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full animate-bounce">
            Scroll to zoom into the villa gate 🏛️
          </div>
        </div>
      )}
    </section>
  );
}