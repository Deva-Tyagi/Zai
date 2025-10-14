import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== CONFIG =====
const CONFIG = {
  colors: {
    plaster: '#E9E4DB',
    stone: '#BFB6A8',
    wood: '#8B6F47',
    metal: '#A5A5A5',
    glass: '#A7C7E7',
    accent: '#D4A574'
  },
  lighting: {
    exposure: 1.1,
    shadowSize: 1024
  },
  camera: {
    ease: 0.12,
    fov: 55
  },
  scroll: {
    scrub: 0.88,
    duration: '350%'
  },
  baySpacing: -6.5
};

// ===== LIGHTING =====
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#FFF8F0" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.4}
        color="#FFE5C8"
        castShadow
        shadow-mapSize={[CONFIG.lighting.shadowSize, CONFIG.lighting.shadowSize]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-6, 8, -4]}
        intensity={0.5}
        color="#B8C5D8"
      />
      <spotLight
        position={[0, 8, 0]}
        intensity={0.3}
        angle={0.6}
        penumbra={0.8}
        color="#FFFFFF"
      />
    </>
  );
}

// ===== ROOM 1: CONCEPT & PLANNING (Arch Studio) =====
function ConceptRoom({ position = [0, 0, 0], active = false }) {
  const groupRef = useRef();
  const traceRef = useRef();
  
  useFrame((state) => {
    if (active && traceRef.current) {
      traceRef.current.material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Arch wall */}
      <group position={[-3, 0, -2]}>
        {Array.from({ length: 3 }).map((_, i) => (
          <group key={i} position={[i * 2, 0, 0]}>
            <mesh castShadow receiveShadow position={[-0.4, 1.5, 0]}>
              <boxGeometry args={[0.3, 3, 0.3]} />
              <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.4, 1.5, 0]}>
              <boxGeometry args={[0.3, 3, 0.3]} />
              <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.8, 0.15, 12, 24, Math.PI]} />
              <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Pinboard with glowing trace */}
      <mesh position={[2, 1.8, -1.8]} castShadow>
        <boxGeometry args={[1.5, 1.2, 0.1]} />
        <meshStandardMaterial color={CONFIG.colors.stone} roughness={0.7} />
      </mesh>
      <mesh ref={traceRef} position={[2, 1.8, -1.7]}>
        <boxGeometry args={[1.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={active ? 1 : 0} />
      </mesh>

      {/* Scale rulers */}
      <mesh position={[2.5, 0.5, 0.5]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.6} />
      </mesh>

      {/* Material spheres on pedestal */}
      <mesh position={[0, 0.8, 1]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 16]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.8} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.3 + i * 0.3, 1.3, 1]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 ? CONFIG.colors.plaster : i === 1 ? CONFIG.colors.stone : CONFIG.colors.wood}
            roughness={0.3 + i * 0.2}
            metalness={i === 2 ? 0.3 : 0}
          />
        </mesh>
      ))}

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.95} />
      </mesh>
    </group>
  );
}

// ===== ROOM 2: MATERIALS SELECTION (Samples Wall) =====
function MaterialsRoom({ position = [0, 0, 0], active = false }) {
  const fanRef = useRef();
  
  useFrame((state) => {
    if (active && fanRef.current) {
      fanRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Sample tiles wall */}
      <group position={[-2.5, 1.5, -2]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const colors = [CONFIG.colors.stone, CONFIG.colors.wood, CONFIG.colors.plaster, CONFIG.colors.metal];
          return (
            <mesh key={i} position={[col * 0.6, -row * 0.6, 0]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.08]} />
              <meshStandardMaterial
                color={colors[i % 4]}
                roughness={0.4 + (i % 3) * 0.2}
                metalness={i % 4 === 3 ? 0.6 : 0}
              />
            </mesh>
          );
        })}
      </group>

      {/* Swatch fan */}
      <group ref={fanRef} position={[2, 1.2, 0.5]} rotation={[0, -0.3, 0]}>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[0, 0, i * 0.02]} rotation={[0, 0, (i - 3) * 0.1]} castShadow>
            <boxGeometry args={[0.15, 0.6, 0.01]} />
            <meshStandardMaterial color={i % 2 === 0 ? CONFIG.colors.wood : CONFIG.colors.stone} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Shelf */}
      <mesh position={[0, 0.8, -1.8]} castShadow>
        <boxGeometry args={[5, 0.08, 0.3]} />
        <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.6} />
      </mesh>

      {/* Spotlight strip */}
      <mesh position={[0, 3, -1.5]}>
        <boxGeometry args={[4, 0.1, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFCC" emissiveIntensity={active ? 0.8 : 0.3} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={CONFIG.colors.stone} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ===== ROOM 3: 3D VISUALIZATION (Model Bench) =====
function VisualizationRoom({ position = [0, 0, 0], active = false }) {
  const sofaRef = useRef();
  const tableRef = useRef();
  const cameraRef = useRef();
  
  useFrame((state) => {
    if (active) {
      if (tableRef.current) {
        tableRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      }
      if (cameraRef.current) {
        cameraRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
      }
    }
  });

  return (
    <group position={position}>
      {/* Room mockup - Sofa */}
      <group ref={sofaRef} position={[-1.5, 0.5, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.6, 0.8]} />
          <meshStandardMaterial color="#4A6B7C" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, -0.3]} castShadow>
          <boxGeometry args={[2, 0.5, 0.2]} />
          <meshStandardMaterial color="#4A6B7C" roughness={0.7} />
        </mesh>
        {[-0.7, 0.7].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 0.8, 0.8]} />
            <meshStandardMaterial color="#4A6B7C" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Coffee table */}
      <group ref={tableRef} position={[0.5, 0.4, 1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.06, 32]} />
          <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.3} />
        </mesh>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.4, -0.35, Math.sin(angle) * 0.4]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.7, 8]} />
              <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.6} />
            </mesh>
          );
        })}
      </group>

      {/* Camera on slider */}
      <mesh ref={cameraRef} position={[2.5, 1.5, -1]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color={CONFIG.colors.metal} emissive="#4488FF" emissiveIntensity={active ? 1 : 0} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[2.5, 1.3, -1]}>
        <boxGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color={CONFIG.colors.metal} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Back wall pane */}
      <mesh position={[0, 1.8, -2]} castShadow>
        <boxGeometry args={[6, 3.6, 0.1]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.7} />
      </mesh>
    </group>
  );
}

// ===== ROOM 4: LIGHTING & STYLING (Reading Nook) =====
function LightingRoom({ position = [0, 0, 0], active = false }) {
  const lampRef = useRef();
  const curtainRef = useRef();
  
  useFrame((state) => {
    if (active && lampRef.current) {
      lampRef.current.material.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (curtainRef.current) {
      const positions = curtainRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      for (let i = 0; i < positions.length; i += 3) {
        const x = curtainRef.current.geometry.attributes.position.array[i];
        positions[i + 2] = Math.sin(x * 2 + time * (active ? 2 : 1)) * 0.1;
      }
      curtainRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Alcove walls */}
      <mesh position={[-2.5, 1.5, -1]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3, 4]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
      </mesh>
      <mesh position={[2.5, 1.5, -1]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 3, 4]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 0.2]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.85} />
      </mesh>

      {/* Floor lamp */}
      <group position={[-1.5, 0, 0.5]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color={CONFIG.colors.metal} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh ref={lampRef} position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FFFFE0" emissive="#FFFFE0" emissiveIntensity={active ? 1.5 : 0.5} />
        </mesh>
      </group>

      {/* Curtain */}
      <mesh ref={curtainRef} position={[1.5, 1.5, -2.8]}>
        <planeGeometry args={[2, 3, 20, 30]} />
        <meshStandardMaterial color={CONFIG.colors.glass} transparent opacity={0.6} side={THREE.DoubleSide} roughness={0.4} />
      </mesh>

      {/* Plant silhouette */}
      <group position={[2, 0, 1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 16]} />
          <meshStandardMaterial color={CONFIG.colors.stone} roughness={0.8} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.15, 0.5, Math.sin(angle) * 0.15]} rotation={[0, angle, Math.PI / 4]} castShadow>
              <coneGeometry args={[0.1, 0.6, 8]} />
              <meshStandardMaterial color="#3A5A40" roughness={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={CONFIG.colors.accent} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ===== ROOM 5: HANDOVER & DELIVERY (Staging Desk) =====
function DeliveryRoom({ position = [0, 0, 0], active = false }) {
  const checklistRef = useRef();
  const planeRef = useRef();
  
  useFrame((state) => {
    if (active) {
      if (checklistRef.current) {
        checklistRef.current.material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      }
      if (planeRef.current) {
        const t = state.clock.elapsedTime * 0.5;
        planeRef.current.position.x = 1 + Math.sin(t) * 2;
        planeRef.current.position.z = -1 + Math.cos(t) * 1.5;
        planeRef.current.rotation.y = t;
      }
    }
  });

  return (
    <group position={position}>
      {/* Drafting table */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.08, 2]} />
        <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.5} />
      </mesh>
      {[[-1.3, 0], [1.3, 0], [-1.3, 1.8], [1.3, 1.8]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.45, pos[1] - 0.9]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.9, 8]} />
          <meshStandardMaterial color={CONFIG.colors.wood} roughness={0.6} />
        </mesh>
      ))}

      {/* Parcel */}
      <mesh position={[-0.8, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color={CONFIG.colors.stone} roughness={0.7} />
      </mesh>
      <mesh position={[-0.8, 1.3, 0]}>
        <boxGeometry args={[0.65, 0.02, 0.1]} />
        <meshStandardMaterial color="#D4A574" emissive="#D4A574" emissiveIntensity={active ? 0.8 : 0.2} />
      </mesh>

      {/* Rolled drawings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.5 + i * 0.15, 1.05, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
          <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.6} />
        </mesh>
      ))}

      {/* Tablet with checklist */}
      <mesh ref={checklistRef} position={[0.5, 1.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.02]} />
        <meshStandardMaterial color="#2C3E50" emissive="#4CAF50" emissiveIntensity={active ? 1 : 0.2} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Paper plane */}
      <group ref={planeRef} position={[1, 1.5, -1]}>
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <coneGeometry args={[0.15, 0.4, 3]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
      </group>

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color={CONFIG.colors.plaster} roughness={0.95} />
      </mesh>
    </group>
  );
}

// ===== CAMERA RIG CONTROLLER =====
function CameraRig({ rigRef }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (rigRef.current) {
      camera.position.lerp(rigRef.current.position, CONFIG.camera.ease);
      camera.quaternion.slerp(
        new THREE.Quaternion().setFromEuler(rigRef.current.rotation),
        CONFIG.camera.ease
      );
    }
  });
  
  return null;
}

// ===== MAIN SCENE =====
function StudioTour({ rigRef, activeRoom }) {
  return (
    <>
      <CameraRig rigRef={rigRef} />
      <StudioLighting />
      <fog attach="fog" args={[CONFIG.colors.plaster, 8, 25]} />

      <ConceptRoom position={[0, 0, 0]} active={activeRoom === 0} />
      <MaterialsRoom position={[0, 0, CONFIG.baySpacing]} active={activeRoom === 1} />
      <VisualizationRoom position={[0, 0, CONFIG.baySpacing * 2]} active={activeRoom === 2} />
      <LightingRoom position={[0, 0, CONFIG.baySpacing * 3]} active={activeRoom === 3} />
      <DeliveryRoom position={[0, 0, CONFIG.baySpacing * 4]} active={activeRoom === 4} />
    </>
  );
}

// ===== SERVICE DATA =====
const SERVICES = [
  {
    title: 'Concept & Space Planning',
    description: 'We transform your vision into structured blueprints, defining spatial flow and material direction before a single model is built.'
  },
  {
    title: 'Material & Finish Selection',
    description: 'Curated palettes of textures, colors, and surfaces that bring tactile realism to every corner of your design.'
  },
  {
    title: '3D Modeling & Visualization',
    description: 'Precision-crafted 3D environments with photorealistic lighting, giving you a complete view before construction begins.'
  },
  {
    title: 'Lighting & Styling Direction',
    description: 'Atmosphere engineering through carefully choreographed lighting setups and styling details that evoke emotion.'
  },
  {
    title: 'Handover & Asset Delivery',
    description: 'Packaged deliverables including renders, models, specs, and documentation—ready for implementation or presentation.'
  }
];

// ===== MAIN COMPONENT =====
export default function ServiceSection() {
  const sectionRef = useRef(null);
  const rigRef = useRef({
    position: new THREE.Vector3(0, 1.5, 8),
    rotation: new THREE.Euler(0, 0, 0)
  });
  const [activeRoom, setActiveRoom] = useState(0);
  const [dpr, setDpr] = useState(1.2);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: CONFIG.scroll.duration,
          scrub: CONFIG.scroll.scrub,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const room = Math.min(4, Math.floor(progress * 5));
            setActiveRoom(room);
          }
        }
      });

      // Room 1: Concept
      tl.to(rigRef.current.position, {
        x: -0.5,
        y: 1.5,
        z: 5.2,
        duration: 0.2
      })
      .to(rigRef.current.rotation, {
        y: -0.12,
        duration: 0.2
      }, '<');

      // Room 2: Materials
      tl.to(rigRef.current.position, {
        x: 0.25,
        y: 1.5,
        z: CONFIG.baySpacing + 3,
        duration: 0.2
      })
      .to(rigRef.current.rotation, {
        y: 0.06,
        duration: 0.2
      }, '<');

      // Room 3: Visualization
      tl.to(rigRef.current.position, {
        x: 0.6,
        y: 1.6,
        z: CONFIG.baySpacing * 2 + 3.8,
        duration: 0.2
      })
      .to(rigRef.current.rotation, {
        y: 0.18,
        duration: 0.2
      }, '<');

      // Room 4: Lighting
      tl.to(rigRef.current.position, {
        x: 0.2,
        y: 1.7,
        z: CONFIG.baySpacing * 3 + 4.4,
        duration: 0.2
      })
      .to(rigRef.current.rotation, {
        y: 0.10,
        duration: 0.2
      }, '<');

      // Room 5: Delivery
      tl.to(rigRef.current.position, {
        x: 0.0,
        y: 1.5,
        z: CONFIG.baySpacing * 4 + 3.6,
        duration: 0.2
      })
      .to(rigRef.current.rotation, {
        y: 0.0,
        duration: 0.2
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
        backgroundColor: CONFIG.colors.plaster
      }}
    >
      {/* Heading Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <h2
          style={{
            fontSize: '3.5rem',
            fontWeight: 300,
            color: '#2C2416',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}
        >
          Our Services
        </h2>
        <p
          style={{
            fontSize: '1.1rem',
            color: '#6A5D4F',
            opacity: 0.9
          }}
        >
          Step into our studio and discover how we bring spaces to life
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 1.5, 8], fov: CONFIG.camera.fov }}
        style={{ width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: CONFIG.lighting.exposure
        }}
        onCreated={({ gl }) => {
          gl.physicallyCorrectLights = true;
        }}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
          onDecline={() => setDpr(0.9)}
        />
        <StudioTour rigRef={rigRef} activeRoom={activeRoom} />
      </Canvas>

      {/* Service Info Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '6%',
          maxWidth: '500px',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3
            style={{
              fontSize: '1.8rem',
              fontWeight: 400,
              color: '#2C2416',
              marginBottom: '0.8rem',
              letterSpacing: '0.02em'
            }}
          >
            {SERVICES[activeRoom].title}
          </h3>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: '#4A3C2A',
              opacity: 0.9
            }}
          >
            {SERVICES[activeRoom].description}
          </p>
        </div>

        {/* Step Indicators */}
        <div
          style={{
            display: 'flex',
            gap: '0.8rem',
            marginTop: '1.5rem',
            justifyContent: 'flex-start'
          }}
        >
          {SERVICES.map((_, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '4px',
                backgroundColor: activeRoom === index ? '#8B6F47' : 'rgba(139, 111, 71, 0.3)',
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div
        style={{
          position: 'absolute',
          right: '4%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          pointerEvents: 'none'
        }}
      >
        {SERVICES.map((service, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              opacity: activeRoom === index ? 1 : 0.4,
              transition: 'opacity 0.3s ease'
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                color: '#2C2416',
                fontWeight: activeRoom === index ? 600 : 400,
                textAlign: 'right',
                minWidth: '120px',
                display: window.innerWidth > 768 ? 'block' : 'none'
              }}
            >
              {service.title.split('&')[0].trim()}
            </span>
            <div
              style={{
                width: activeRoom === index ? '12px' : '8px',
                height: activeRoom === index ? '12px' : '8px',
                borderRadius: '50%',
                backgroundColor: activeRoom === index ? '#8B6F47' : '#BFB6A8',
                transition: 'all 0.3s ease',
                border: activeRoom === index ? '2px solid #8B6F47' : 'none'
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}