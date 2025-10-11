// src/components/sections/Hero.jsx
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Scene3D from '../3d/Scene3D';
import PixelCube from '../3d/Villa/PixelCube';
import PixelTransition from '../3d/Villa/PixelTransition';
import VillaLighting from '../3d/Villa/VillaLighting';
import VillaModel from '../3d/Villa/VillaModel';
import useHeroObserver from '../hooks/useHeroObserver';

gsap.registerPlugin(ScrollToPlugin);

function BackgroundFade({ phase }) {
  const { gl } = useThree();
  useEffect(() => {
    const from = new THREE.Color('#000000');
    const to = new THREE.Color(phase === 'intro' ? '#000000' : '#F5F0E6');
    const tmp = { t: 0 };
    gsap.to(tmp, {
      t: 1,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => gl.setClearColor(from.clone().lerp(to, tmp.t))
    });
  }, [phase, gl]);
  return null;
}

function ParallaxPlane({
  colorUrl = '/textures/villa.jpg',
  depthUrl = '/textures/villa-depth.png',
  segments = 256,
  displacement = 0.45,
  z = -2.2,
  moveX = 0.32,
  moveY = 0.18,
  damp = 0.10,
}) {
  const group = useRef();
  const [colorTex, depthTex] = useTexture([colorUrl, depthUrl]);
  const { camera, size } = useThree();

  const { wFull, hFull } = useMemo(() => {
    const d = Math.abs(camera.position.z - z);
    const f = (camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(f / 2) * d;
    const w = h * (size.width / size.height);
    return { wFull: w, hFull: h };
  }, [camera.position.z, camera.fov, size.width, size.height, z]);

  const [planeW, planeH] = useMemo(() => {
    const iw = colorTex?.image?.width ?? 1600;
    const ih = colorTex?.image?.height ?? 900;
    const a = iw / ih;
    const v = wFull / hFull;
    return a > v ? [hFull * a, hFull] : [wFull, wFull / a];
  }, [colorTex, wFull, hFull]);

  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.current.x = Math.max(-1, Math.min(1, x));
      mouse.current.y = Math.max(-1, Math.min(1, y));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const px = mouse.current.x;
    const py = mouse.current.y;
    const targetX = px * moveX;
    const targetY = py * moveY;
    group.current.position.x += (targetX - group.current.position.x) * damp;
    group.current.position.y += (targetY - group.current.position.y) * damp;
  });

  return (
    <group ref={group} position={[0, 0, z]}>
      <mesh>
        <planeGeometry args={[planeW, planeH, segments, segments]} />
        <meshStandardMaterial
          map={colorTex}
          displacementMap={depthTex}
          displacementScale={displacement}
          roughness={0.8}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

export default function Hero() {
  // active=false after hero completes to stop intercepting input and restore native scroll
  const [done, setDone] = useState(false);
  const { anim } = useHeroObserver({ active: !done, sensitivity: 0.0016, ease: 0.10 });

  const [phase, setPhase] = useState('intro'); // 'intro' -> 'exploding' -> 'revealing' -> 'done'
  const explosion = useRef({ value: 0 });
  const [showSil, setShowSil] = useState(false);
  const silOpacity = useRef({ v: 0 });

  // Lock/unlock page scroll
  useEffect(() => {
    if (!done) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
  }, [done]);

  // Map anim -> acts; release when done and scroll to the next section
  useEffect(() => {
    const p = anim || 0;

    if (p < 0.10) {
      setPhase('intro');
      explosion.current.value = 0;
      setShowSil(false);
    } else if (p < 0.30) {
      setPhase('exploding');
      explosion.current.value = Math.min(1, Math.max(0, (p - 0.10) / 0.20)); // slower breakup window
      setShowSil(false);
    } else if (p < 0.55) {
      setPhase('revealing');
      if (!showSil) setShowSil(true);
      const local = (p - 0.30) / 0.25;
      silOpacity.current.v = 1 - Math.min(1, Math.max(0, local));
    } else {
      setPhase('done');
      setShowSil(false);
      explosion.current.value = 1;
      silOpacity.current.v = 0;

      if (!done) {
        setDone(true); // disable observer and unlock body
        const next = document.querySelector('#villa-journey');
        if (next) gsap.to(window, { duration: 0.8, scrollTo: next, ease: 'power2.out' });
      }
    }
  }, [anim, showSil, done]);

  return (
    // w-full avoids the 100vw scrollbar gap
    <section className="hero relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-[1]">
        <Scene3D>
          <BackgroundFade phase={phase} />
          <VillaLighting />

          {phase === 'intro' && <PixelCube />}
          {phase === 'exploding' && <PixelTransition progressRef={explosion} count={240} />}

          {showSil && (
            <group position={[0, -0.25, -2.0]}>
              <VillaModel opacity={silOpacity.current.v} />
            </group>
          )}

          {phase === 'done' && (
            <ParallaxPlane
              colorUrl="/textures/villa.jpg"
              depthUrl="/textures/villa-depth.png"
              displacement={0.45}
              segments={256}
              z={-2.2}
              moveX={0.32}
              moveY={0.18}
              damp={0.10}
            />
          )}
        </Scene3D>
      </div>

      {/* <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-700 ${phase === 'done' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-center max-w-[820px] px-5">
          <h1 className="font-['Playfair_Display'] font-bold text-[clamp(2.2rem,6vw,4.4rem)] leading-tight text-[#2D1B3D] mb-5">
            Premium Interior<br/><span className="text-[#6A4C93]">Design Experience</span>
          </h1>
          <p className="text-[clamp(1rem,2.2vw,1.25rem)] text-[#2D1B3D]/85 leading-relaxed">
            High-end visual design and storytelling studio specializing in 3D, animation, and immersive narratives
          </p>
        </div>
      </div> */}
    </section>
  );
}
