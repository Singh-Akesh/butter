import React from 'react'

function MacBook(): React.JSX.Element {
  const silver = '#c8c8c8'
  const darkSilver = '#a8a8a8'

  return (
    <group>
      {/* Bottom base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.008, 0.34]} />
        <meshStandardMaterial color={darkSilver} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Top lid */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.52, 0.008, 0.34]} />
        <meshStandardMaterial color={silver} metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Apple logo on lid */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.002, 24]} />
        <meshStandardMaterial color={darkSilver} metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Thin gap line between lid and base */}
      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[0.522, 0.002, 0.342]} />
        <meshStandardMaterial color="#555555" roughness={0.5} />
      </mesh>
    </group>
  )
}

export function Laptops(): React.JSX.Element {
  const count = 6
  const tableTop = 0.812

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const radius = 1.9
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return (
          <group key={i} position={[x, tableTop, z]} rotation={[0, angle, 0]}>
            <MacBook />
          </group>
        )
      })}
    </group>
  )
}
