import { useRef } from 'react';
import { Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function FinancialOrb() {
  const orbRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    const { x, y } = state.pointer;
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.16;
      orbRef.current.rotation.x = y * 0.12;
      orbRef.current.rotation.z = x * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.08;
      ringRef.current.rotation.z -= delta * 0.12;
    }
  });

  return (
    <group ref={orbRef}>
      <Sphere args={[1.55, 64, 64]}>
        <meshStandardMaterial
          color="#1F4D3D"
          emissive="#1F4D3D"
          emissiveIntensity={0.45}
          metalness={0.7}
          roughness={0.24}
        />
      </Sphere>
      <mesh ref={ringRef} rotation={[Math.PI / 2.8, 0.2, 0]}>
        <torusGeometry args={[1.82, 0.018, 12, 96]} />
        <meshStandardMaterial color="#C9A227" emissive="#C9A227" emissiveIntensity={1.5} />
      </mesh>
      <mesh rotation={[0.4, 0.8, 0]}>
        <torusGeometry args={[1.95, 0.008, 8, 96]} />
        <meshStandardMaterial color="#C9A227" emissive="#C9A227" emissiveIntensity={1.2} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
