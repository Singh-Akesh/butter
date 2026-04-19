import React from 'react'

export function Table(): React.JSX.Element {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 64]} />
        <meshStandardMaterial color="#6b3a2a" roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Center column */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.04, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}
