import { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';

function createParticles(count) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const radius = 2.4 + (((index * 17) % 100) / 100) * 1.8;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = (((index * 29) % 100) / 100 - 0.5) * 3.2;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
  }
  return positions;
}

export default function ParticleStream() {
  const incomeParticles = useMemo(() => createParticles(46), []);
  const expenseParticles = useMemo(() => createParticles(46), []);

  return (
    <group rotation={[0.15, 0, -0.1]}>
      <Points positions={incomeParticles} stride={3} frustumCulled>
        <PointMaterial color="#2F7A52" size={0.045} sizeAttenuation transparent opacity={0.82} />
      </Points>
      <Points positions={expenseParticles} stride={3} rotation={[0.2, Math.PI, 0]} frustumCulled>
        <PointMaterial color="#A8433A" size={0.035} sizeAttenuation transparent opacity={0.7} />
      </Points>
    </group>
  );
}
