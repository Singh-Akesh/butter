import React from 'react'

function ChairUnit(): React.JSX.Element {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.06, 0.55]} />
        <meshStandardMaterial color="#2c1f14" roughness={0.7} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.8, -0.25]} castShadow>
        <boxGeometry args={[0.55, 0.6, 0.05]} />
        <meshStandardMaterial color="#2c1f14" roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.22, -0.22], [-0.22, 0.22], [0.22, -0.22], [0.22, 0.22]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export function Chairs(): React.JSX.Element {
  const count = 6
  const radius = 3.2

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, angle + Math.PI, 0]}>
            <ChairUnit />
          </group>
        )
      })}
    </group>
  )
}
