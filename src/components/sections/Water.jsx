import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Water Shader Material
const WaterShader = {
  vertexShader: `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      vec3 pos = position;
      float wave1 = sin(pos.x * 2.0 + time) * 0.15;
      float wave2 = sin(pos.y * 1.5 + time * 0.8) * 0.12;
      pos.z += wave1 + wave2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 waterColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vec2 uv = vUv * 8.0;
      float wave = sin(uv.x + time) * cos(uv.y + time * 0.7) * 0.5 + 0.5;
      
      vec3 color = mix(waterColor, vec3(0.4, 0.7, 0.9), wave * 0.3);
      float alpha = 0.6 + wave * 0.2;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
};

function Water() {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.5;
    }
  });

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      waterColor: { value: new THREE.Color(0x0077be) }
    }),
    []
  );

  return (
    <mesh ref={meshRef} position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.8, 3.8, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={WaterShader.vertexShader}
        fragmentShader={WaterShader.fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Shark() {
  const groupRef = useRef();
  
  useEffect(() => {
    if (groupRef.current) {
      // Swimming animation path
      gsap.to(groupRef.current.position, {
        x: 1.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(groupRef.current.position, {
        z: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 8,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Shark body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 1.2, 8]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      
      {/* Dorsal fin */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      
      {/* Side fins */}
      <mesh position={[-0.15, -0.15, 0.2]} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      <mesh position={[-0.15, -0.15, -0.2]} rotation={[0, -Math.PI / 4, -Math.PI / 6]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </group>
  );
}

function GlassCube() {
  // Create tiled texture for pool walls
  const poolTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const tileSize = 32;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#1e88e5' : '#2196f3';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.strokeStyle = '#0d47a1';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  return (
    <group>
      {/* Glass walls */}
      <mesh position={[0, 0, 2]}>
        <planeGeometry args={[4, 4]} />
        <meshPhysicalMaterial 
          map={poolTexture}
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      <mesh position={[0, 0, -2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshPhysicalMaterial 
          map={poolTexture}
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      <mesh position={[2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshPhysicalMaterial 
          map={poolTexture}
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      <mesh position={[-2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshPhysicalMaterial 
          map={poolTexture}
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      
      {/* Bottom */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={poolTexture} />
      </mesh>
      
      {/* Glass edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(4, 4, 4)]} />
        <lineBasicMaterial color="#0d47a1" linewidth={2} />
      </lineSegments>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(8, 5, 8);
    
    // Scroll-triggered zoom animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });
    
    tl.to(camera.position, {
      x: 5,
      y: 3,
      z: 5,
      duration: 1
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [camera]);
  
  return null;
}

function Scene() {
  return (
    <>
      <CameraController />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      
      {/* Scene objects */}
      <GlassCube />
      <Water />
      <Shark />
      
      {/* Controls */}
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

export default function WaterScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'auto' }}>
      <Canvas
        shadows
        camera={{ position: [8, 5, 8], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #87ceeb 0%, #4a90e2 100%)' }}
      >
        <Scene />
      </Canvas>
      
      {/* Scroll content for zoom effect */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '300vh',
        pointerEvents: 'none',
        zIndex: -1
      }} />
      
      {/* UI Info */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 15px',
        borderRadius: '8px',
        pointerEvents: 'none'
      }}>
        <div>🖱️ Drag to rotate • Scroll to zoom • Pinch to zoom on mobile</div>
        <div style={{ marginTop: '5px' }}>🦈 Watch the shark swim through the water tank</div>
      </div>
    </div>
  );
}