import React, { useRef, useLayoutEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import PoolDive from './PoolDive.jsx';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== ENHANCED LIGHTING WITH ATMOSPHERIC EFFECTS =====
function VillaLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#FFF8E7" />
      <directionalLight
        position={[30, 40, 20]}
        intensity={1.8}
        color="#FFE5B4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-20, 25, -15]}
        intensity={0.6}
        color="#FFD9A0"
      />
      <hemisphereLight args={['#87CEEB', '#D4BFA0', 0.8]} />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#FFE4B5" distance={25} decay={2} />
    </>
  );
}

// ===== ENHANCED ARCH WITH TEXTURE DETAILS =====
function Arch({ position = [0, 0, 0], width = 2.8, height = 4.5, depth = 0.8 }) {
  return (
    <group position={position}>
      {/* Left Pillar with Capital */}
      <mesh castShadow receiveShadow position={[-width/2, height/2, 0]}>
        <boxGeometry args={[0.5, height, depth]} />
        <meshStandardMaterial 
          color="#E8DCC8" 
          roughness={0.85} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Pillar Capital */}
      <mesh castShadow position={[-width/2, height, 0]}>
        <boxGeometry args={[0.7, 0.3, depth + 0.2]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.8} />
      </mesh>
      
      {/* Right Pillar with Capital */}
      <mesh castShadow receiveShadow position={[width/2, height/2, 0]}>
        <boxGeometry args={[0.5, height, depth]} />
        <meshStandardMaterial 
          color="#E8DCC8" 
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      
      <mesh castShadow position={[width/2, height, 0]}>
        <boxGeometry args={[0.7, 0.3, depth + 0.2]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.8} />
      </mesh>
      
      {/* Enhanced Arch Segments */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 11) * Math.PI;
        const x = Math.cos(angle) * (width / 2);
        const y = height + Math.sin(angle) * (width / 2);
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, -angle]} castShadow>
            <boxGeometry args={[0.5, 0.35, depth]} />
            <meshStandardMaterial 
              color="#E8DCC8" 
              roughness={0.75}
              metalness={0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ===== ENHANCED ARCADE =====
function Arcade({ position = [0, 0, 0], count = 5, spacing = 3.5 }) {
  const totalLength = count * spacing;
  
  return (
    <group position={position}>
      {/* Main Wall */}
      <mesh position={[0, 3, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 6, totalLength]} />
        <meshStandardMaterial 
          color="#E8DCC8" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      {/* Floor with Tiles */}
      <mesh position={[0, 0.01, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, totalLength]} />
        <meshStandardMaterial 
          color="#F5EFE7" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Roof with Shadow Depth */}
      <mesh position={[0, 6.5, totalLength / 2 - spacing / 2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[5.5, totalLength + 0.8]} />
        <meshStandardMaterial 
          color="#B89968" 
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>
      
      {/* Arches */}
      {Array.from({ length: count }).map((_, i) => (
        <Arch key={i} position={[0, 0, i * spacing]} width={2.8} height={4.5} depth={0.8} />
      ))}
    </group>
  );
}

// ===== ENHANCED PERGOLA WITH VINES =====
function Pergola({ position = [0, 0, 0], width = 4, length = 18 }) {
  return (
    <group position={position}>
      {/* Wooden Posts with Texture */}
      {[
        [-width/2, -length/2 + 1],
        [width/2, -length/2 + 1],
        [-width/2, length/2 - 1],
        [width/2, length/2 - 1]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -2.5, z]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 5, 8]} />
          <meshStandardMaterial 
            color="#6B5033" 
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
      
      {/* Main Beam */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[width + 0.4, 0.12, length]} />
        <meshStandardMaterial 
          color="#A0826D" 
          roughness={0.85}
        />
      </mesh>
      
      {/* Cross Beams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0.25, -length/2 + (i * length/7)]} castShadow>
          <boxGeometry args={[width + 0.6, 0.08, 0.15]} />
          <meshStandardMaterial color="#8B7355" roughness={0.85} />
        </mesh>
      ))}
      
      {/* Vine Details */}
      {Array.from({ length: 15 }).map((_, i) => {
        const z = -length/2 + Math.random() * length;
        const x = (Math.random() - 0.5) * width;
        return (
          <mesh key={`vine-${i}`} position={[x, -0.3, z]} rotation={[0, Math.random() * Math.PI, 0]}>
            <cylinderGeometry args={[0.03, 0.02, Math.random() * 1.5 + 0.5, 4]} />
            <meshStandardMaterial color="#3A5F3B" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

// ===== ENHANCED REALISTIC POOL =====
function Pool({ position = [0, 0, 0], width = 8, length = 14, depth = 1.2 }) {
  return (
    <group position={position}>
      {/* Pool Floor with Tiles */}
      <mesh position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial 
          color="#2d7a8f" 
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* Pool Walls */}
      <mesh position={[-width/2, -depth/2, 0]} receiveShadow>
        <boxGeometry args={[0.15, depth, length]} />
        <meshStandardMaterial color="#1d5a6f" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[width/2, -depth/2, 0]} receiveShadow>
        <boxGeometry args={[0.15, depth, length]} />
        <meshStandardMaterial color="#1d5a6f" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, -depth/2, -length/2]} receiveShadow>
        <boxGeometry args={[width, depth, 0.15]} />
        <meshStandardMaterial color="#1d5a6f" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, -depth/2, length/2]} receiveShadow>
        <boxGeometry args={[width, depth, 0.15]} />
        <meshStandardMaterial color="#1d5a6f" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Water Surface with Reflections */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial 
          color="#2d8da8" 
          transparent 
          opacity={0.85} 
          roughness={0.05}
          metalness={0.7}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Enhanced Pool Coping */}
      <mesh position={[-width/2 - 0.25, 0.12, 0]} castShadow>
        <boxGeometry args={[0.5, 0.24, length + 1]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[width/2 + 0.25, 0.12, 0]} castShadow>
        <boxGeometry args={[0.5, 0.24, length + 1]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.12, -length/2 - 0.25]} castShadow>
        <boxGeometry args={[width + 1, 0.24, 0.5]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.12, length/2 + 0.25]} castShadow>
        <boxGeometry args={[width + 1, 0.24, 0.5]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.65} metalness={0.1} />
      </mesh>
      
      {/* Pool Steps */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[width/2 - 0.5, -i * 0.3, length/2 - 0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.1, 0.35]} />
          <meshStandardMaterial color="#D4C4AC" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ===== ENHANCED PLANTS =====
function Plant({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Decorative Pot */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.5, 16]} />
        <meshStandardMaterial 
          color="#C9B89A" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Pot Rim */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.08, 16]} />
        <meshStandardMaterial color="#B89968" roughness={0.75} />
      </mesh>
      
      {/* Palm Fronds */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const radius = 0.15;
        return (
          <group key={i}>
            <mesh 
              position={[Math.cos(angle) * radius, 0.65, Math.sin(angle) * radius]} 
              rotation={[0, angle, Math.PI / 3.2]}
            >
              <coneGeometry args={[0.18, 0.85, 6]} />
              <meshStandardMaterial 
                color="#4A7C59" 
                roughness={0.7}
                metalness={0}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Soil */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial color="#5C4033" roughness={0.95} />
      </mesh>
    </group>
  );
}

// ===== ENHANCED STAIRS =====
function Stairs({ position = [0, 0, 0], steps = 4 }) {
  return (
    <group position={position}>
      {Array.from({ length: steps }).map((_, i) => (
        <group key={i}>
          <mesh position={[0, i * 0.18, i * 0.32]} castShadow receiveShadow>
            <boxGeometry args={[3.8, 0.18, 0.38]} />
            <meshStandardMaterial 
              color="#E8DCC8" 
              roughness={0.8}
              metalness={0.05}
            />
          </mesh>
          {/* Step Riser */}
          <mesh position={[0, i * 0.18 - 0.09, i * 0.32 + 0.19]} castShadow>
            <boxGeometry args={[3.8, 0.18, 0.02]} />
            <meshStandardMaterial color="#D4C4AC" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ===== ENHANCED BOUNDARY WALLS =====
function BoundaryWalls() {
  return (
    <group>
      {/* Back Wall with Texture */}
      <mesh position={[0, 4, -18]} receiveShadow castShadow>
        <boxGeometry args={[45, 8, 1.2]} />
        <meshStandardMaterial 
          color="#E8DCC8" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-22, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 8, 40]} />
        <meshStandardMaterial 
          color="#E8DCC8" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[22, 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 8, 40]} />
        <meshStandardMaterial 
          color="#E8DCC8" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

// ===== ENHANCED VAULTED ROOF =====
function VaultedRoof() {
  return (
    <group position={[0, 8, 0]}>
      {/* Main Ceiling */}
      <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[44, 0.35, 38]} />
        <meshStandardMaterial 
          color="#F5EFE7" 
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>
      
      {/* Wooden Beams - Longitudinal */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`beam-long-${i}`} position={[(i - 2) * 8, 2.95, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 38]} />
          <meshStandardMaterial 
            color="#8B7355" 
            roughness={0.85}
          />
        </mesh>
      ))}
      
      {/* Wooden Beams - Transverse */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`beam-trans-${i}`} position={[0, 2.95, (i - 2) * 8]} castShadow>
          <boxGeometry args={[44, 0.5, 0.4]} />
          <meshStandardMaterial 
            color="#8B7355" 
            roughness={0.85}
          />
        </mesh>
      ))}
      
      {/* Central Dome Decoration */}
      <mesh position={[0, 2.7, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.2, 32]} />
        <meshStandardMaterial 
          color="#F5EFE7" 
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Decorative Patterns */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh 
            key={`pattern-${i}`}
            position={[Math.cos(angle) * 1.2, 2.8, Math.sin(angle) * 1.2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.15, 0.15, 0.05, 8]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

// ===== ENHANCED CHANDELIER =====
function Chandelier({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Chain */}
      <mesh position={[0, 10, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
        <meshStandardMaterial 
          color="#8B7355" 
          roughness={0.5} 
          metalness={0.4}
        />
      </mesh>
      
      {/* Top Crown */}
      <mesh position={[0, 8.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.5, 1, 16]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.25} 
          metalness={0.85}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Light Arms */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.4;
        return (
          <group key={`light-${i}`} position={[Math.cos(angle) * radius, 7.5, Math.sin(angle) * radius]}>
            {/* Arm */}
            <mesh position={[0, 0, 0]} rotation={[0, angle, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
              <meshStandardMaterial 
                color="#D4AF37" 
                roughness={0.3} 
                metalness={0.8}
              />
            </mesh>
            
            {/* Candle Holder */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.07, 0.3, 8]} />
              <meshStandardMaterial 
                color="#D4AF37" 
                roughness={0.3} 
                metalness={0.8}
              />
            </mesh>
            
            {/* Candle */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
              <meshStandardMaterial 
                color="#FFF8DC" 
                roughness={0.7}
              />
            </mesh>
            
            {/* Flame */}
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial 
                color="#FFD700" 
                emissive="#FFA500" 
                emissiveIntensity={2}
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Individual Light */}
            <pointLight 
              position={[0, 0.65, 0]} 
              intensity={0.4} 
              distance={6} 
              color="#FFE4B5"
              decay={2}
            />
          </group>
        );
      })}
      
      {/* Center Globe */}
      <mesh position={[0, 7, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.2} 
          metalness={0.9}
          emissive="#D4AF37"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Main Light */}
      <pointLight 
        position={[0, 7, 0]} 
        intensity={2} 
        distance={20} 
        color="#FFE4B5"
        decay={2}
      />
    </group>
  );
}

// ===== ENHANCED FOUNTAIN =====
function Fountain({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.1, 0.36, 24]} />
        <meshStandardMaterial 
          color="#D4C4AC" 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Water Basin */}
      <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.95, 24]} />
        <meshStandardMaterial 
          color="#2d8da8" 
          transparent 
          opacity={0.8}
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>
      
      {/* Center Column */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 1.8, 12]} />
        <meshStandardMaterial 
          color="#D4C4AC" 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Top Ornament */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial 
          color="#C9B89A" 
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>
      
      {/* Decorative Base Ring */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <torusGeometry args={[0.92, 0.08, 12, 24]} />
        <meshStandardMaterial color="#B89968" roughness={0.65} />
      </mesh>
    </group>
  );
}

// ===== ENHANCED LANTERN =====
function Lantern({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 3.2, 8]} />
        <meshStandardMaterial 
          color="#4A3C2A" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.3, 8]} />
        <meshStandardMaterial color="#3A2C1A" roughness={0.85} />
      </mesh>
      
      {/* Lantern Housing */}
      <mesh position={[0, 3.3, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 6]} />
        <meshStandardMaterial 
          color="#4A3C2A" 
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Lantern Glass */}
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.45, 6]} />
        <meshStandardMaterial 
          color="#FFF4E0" 
          emissive="#FFD9A0" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Top Cap */}
      <mesh position={[0, 3.65, 0]} castShadow>
        <coneGeometry args={[0.25, 0.3, 6]} />
        <meshStandardMaterial color="#4A3C2A" roughness={0.7} />
      </mesh>
      
      {/* Light */}
      <pointLight 
        position={[0, 3.3, 0]} 
        intensity={0.6} 
        distance={5} 
        color="#FFE4B5"
        decay={2}
      />
    </group>
  );
}

// ===== ENHANCED SEATING =====
function SeatingArea({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.12, 0.65]} />
        <meshStandardMaterial 
          color="#8B6F47" 
          roughness={0.8}
        />
      </mesh>
      
      {/* Cushion */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.9, 0.08, 0.6]} />
        <meshStandardMaterial 
          color="#B8956F" 
          roughness={0.9}
        />
      </mesh>
      
      {/* Legs */}
      {[[-0.85, -0.25], [0.85, -0.25], [-0.85, 0.25], [0.85, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.14, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.28, 8]} />
          <meshStandardMaterial color="#6B5033" roughness={0.85} />
        </mesh>
      ))}
      
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.28]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.65, 0.1]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ===== DECORATIVE COLUMNS =====
function DecorativeColumn({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.32, 4, 16]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.35, 0.4, 16]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#D4C4AC" roughness={0.75} />
      </mesh>
    </group>
  );
}

// ===== CAMERA CONTROLLER =====
function CameraController({ cameraGroupRef }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (cameraGroupRef.current) {
      camera.position.lerp(cameraGroupRef.current.position, 0.08);
      camera.quaternion.slerp(
        new THREE.Quaternion().setFromEuler(cameraGroupRef.current.rotation),
        0.08
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
      
      {/* Ground with Tile Pattern */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#F5EFE7" 
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      
      {/* Tile Grid Lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <React.Fragment key={`tiles-${i}`}>
          <mesh position={[-25 + i * 5, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.05, 50]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.005, -25 + i * 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 0.05]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}

      <BoundaryWalls />
      <VaultedRoof />
      <Chandelier position={[0, 0, 0]} />
      
      {/* Arcade Galleries */}
      <Arcade position={[-6, 0, -4]} count={6} spacing={3.5} />
      <Arcade position={[7.5, 0, 0]} count={5} spacing={3.5} />
      
      {/* Pergola Walkway */}
      <Pergola position={[-6, 5.8, 6.5]} width={4.5} length={21} />
      
      {/* Central Pool */}
      <Pool position={[0, 0, 2]} width={8} length={14} depth={1.2} />
      
      {/* Decorative Elements */}
      <Fountain position={[0, 0, -5]} />
      <Stairs position={[8, 0, 12]} steps={4} />
      
      {/* Plants */}
      <Plant position={[-5, 0, -2]} scale={0.9} />
      <Plant position={[-5, 0, 4]} scale={1} />
      <Plant position={[-5, 0, 10]} scale={0.95} />
      <Plant position={[6.5, 0, 1]} scale={1} />
      <Plant position={[6.5, 0, 6]} scale={0.9} />
      <Plant position={[6.5, 0, 11]} scale={0.95} />
      <Plant position={[-10, 0, -6]} scale={0.85} />
      <Plant position={[10, 0, -6]} scale={0.85} />
      
      {/* Lanterns */}
      <Lantern position={[-4, 0, -6]} />
      <Lantern position={[5, 0, -6]} />
      <Lantern position={[-4, 0, 14]} />
      <Lantern position={[5, 0, 14]} />
      
      {/* Seating Areas */}
      <SeatingArea position={[-8, 0, 8]} />
      <SeatingArea position={[9, 0, 8]} />
      <SeatingArea position={[-8, 0, -2]} />
      <SeatingArea position={[9, 0, -2]} />
      
      {/* Decorative Columns */}
      <DecorativeColumn position={[-10, 0, -8]} />
      <DecorativeColumn position={[10, 0, -8]} />
      
      {/* Ambient Fog for Depth */}
      <fog attach="fog" args={['#F5EFE7', 30, 60]} />
    </>
  );
}

// ===== MAIN COMPONENT =====
export default function VillaJourney() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const cameraGroupRef = useRef({ 
    position: new THREE.Vector3(0, 3.5, 20), 
    rotation: new THREE.Euler(-0.1, 0, 0) 
  });
  const [dpr, setDpr] = useState(1);
  const [showPoolDive, setShowPoolDive] = useState(false);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Trigger PoolDive when camera reaches above pool (around 85% progress)
            if (self.progress >= 0.85 && !showPoolDive) {
              setShowPoolDive(true);
              setTimeout(() => {
                self.kill();
              }, 100);
            }
          }
        }
      });

      // Enhanced camera journey - straight dive into pool
      tl.to(cameraGroupRef.current.position, { 
        x: -5, y: 4, z: 10, 
        duration: 0.2,
        ease: "power1.inOut"
      })
      .to(cameraGroupRef.current.rotation, { 
        y: 0.4, x: -0.15, 
        duration: 0.2,
        ease: "power1.inOut"
      }, '<')
      
      .to(cameraGroupRef.current.position, { 
        x: -2, y: 3.2, z: 4, 
        duration: 0.2,
        ease: "power1.inOut"
      })
      .to(cameraGroupRef.current.rotation, { 
        y: 0.5, x: -0.18, 
        duration: 0.2,
        ease: "power1.inOut"
      }, '<')
      
      .to(cameraGroupRef.current.position, { 
        x: 3, y: 3.5, z: 8, 
        duration: 0.2,
        ease: "power1.inOut"
      })
      .to(cameraGroupRef.current.rotation, { 
        y: -0.35, x: -0.12, 
        duration: 0.2,
        ease: "power1.inOut"
      }, '<')
      
      .to(cameraGroupRef.current.position, { 
        x: 0, y: 4, z: 10, 
        duration: 0.15,
        ease: "power1.inOut"
      })
      .to(cameraGroupRef.current.rotation, { 
        y: 0, x: -0.08, 
        duration: 0.15,
        ease: "power1.inOut"
      }, '<')
      
      // Approach the pool from above
      .to(cameraGroupRef.current.position, { 
        x: 0, y: 3, z: 5, 
        duration: 0.15,
        ease: "power1.inOut"
      })
      .to(cameraGroupRef.current.rotation, { 
        x: -0.3, 
        duration: 0.15,
        ease: "power1.inOut"
      }, '<')
      
      // Descend directly toward pool center - stops here before PoolDive takes over
      .to(cameraGroupRef.current.position, { 
        x: 0, y: 2, z: 3, 
        duration: 0.15,
        ease: "power2.in"
      })
      .to(cameraGroupRef.current.rotation, { 
        x: -0.5, 
        duration: 0.15,
        ease: "power2.in"
      }, '<');
    }, sectionRef);

    return () => ctx.revert();
  }, [showPoolDive]);

  return (
    <div ref={containerRef} style={{ position: 'relative', background: '#0a3a4a', overflow: 'hidden' }}>
      <section
        ref={sectionRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          background: 'linear-gradient(to bottom, #87CEEB 0%, #FAF6F0 30%, #F5EFE7 70%, #F0E8DC 100%)',
          display: showPoolDive ? 'none' : 'block',
          overflow: 'hidden'
        }}
      >
        <Canvas
          shadows
          dpr={dpr}
          camera={{ position: [0, 3.5, 20], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ 
            antialias: true, 
            alpha: false, 
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
        >
          <PerformanceMonitor
            onIncline={() => setDpr(Math.min(1.5, window.devicePixelRatio))}
            onDecline={() => setDpr(0.75)}
          />
          <CourtyardScene cameraGroupRef={cameraGroupRef} />
        </Canvas>
        
        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#8B7355',
          fontSize: '14px',
          fontFamily: 'Georgia, serif',
          textAlign: 'center',
          opacity: 0.8,
          pointerEvents: 'none'
        }}>
          <div style={{ marginBottom: '10px' }}>Scroll to explore</div>
          <div style={{
            width: '2px',
            height: '30px',
            background: 'linear-gradient(to bottom, #8B7355, transparent)',
            margin: '0 auto',
            animation: 'bounce 2s infinite'
          }}></div>
        </div>
        
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(10px); opacity: 0.5; }
          }
        `}</style>
      </section>

      {showPoolDive && (
        <div style={{ width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
           <PoolDive />
        </div>
      )}
    </div>
  );
}