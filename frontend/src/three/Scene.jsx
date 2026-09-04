import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import FinancialOrb from './FinancialOrb';
import ParticleStream from './ParticleStream';

/* R3F's render loop requires mutating the live camera object for parallax. */
/* eslint-disable react-hooks/immutability */

function CameraParallax() {
  const camera = useThree((state) => state.camera);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    target.current.x = state.pointer.x * 0.32;
    target.current.y = state.pointer.y * 0.2;
    camera.position.x += (target.current.x - camera.position.x) * 0.035;
    camera.position.y += (target.current.y - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene() {
  return (
    <Canvas
      className="landing-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => event.preventDefault(), { once: true });
      }}
    >
      <color attach="background" args={["#07120E"]} />
      <ambientLight intensity={1.1} />
      <pointLight position={[4, 3, 5]} intensity={24} distance={12} color="#C9A227" />
      <directionalLight position={[-4, 2, 3]} intensity={2.4} color="#2F7A52" />
      <CameraParallax />
      <ParticleStream />
      <FinancialOrb />
    </Canvas>
  );
}
