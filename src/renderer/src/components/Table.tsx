import React from 'react'

export function Table(): React.JSX.Element {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 64]} />
        <meshStandardMaterial color="#1a1a3a" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Glow ring */}
      <mesh position={[0, 0.74, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 64]} />
        <meshStandardMaterial color="#63b3ff" emissive="#63b3ff" emissiveIntensity={2} />
      </mesh>

      {/* Center column */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#111128" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.04, 32]} />
        <meshStandardMaterial color="#111128" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}
