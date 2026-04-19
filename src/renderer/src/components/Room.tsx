import React from 'react'

const glassMaterial = (
  <meshStandardMaterial
    color="#b8d4e8"
    transparent
    opacity={0.25}
    roughness={0.05}
    metalness={0.2}
    depthWrite={false}
  />
)

export function Room(): React.JSX.Element {
  return (
    <group>
      <Floor />
      <Ceiling />
      <BackWall />
      <LeftWall />
      <RightWall />
    </group>
  )
}

function Floor(): React.JSX.Element {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#c8b89a" roughness={0.8} metalness={0} />
    </mesh>
  )
}

function Ceiling(): React.JSX.Element {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#f0ede8" roughness={1} />
    </mesh>
  )
}

function BackWall(): React.JSX.Element {
  return (
    <group position={[0, 2.5, -8]}>
      {/* Glass panels left and right of screen */}
      <mesh position={[-6.5, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        {glassMaterial}
      </mesh>
      <mesh position={[6.5, 0, 0]}>
        <planeGeometry args={[7, 5]} />
        {glassMaterial}
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[6.4, 3.8]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Screen display */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[6, 3.5]} />
        <meshStandardMaterial color="#0a1628" emissive="#1a3a6a" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>

      {/* Screen glow */}
      <pointLight position={[0, 0, 0.5]} intensity={1.5} color="#4a8fd4" distance={6} />
    </group>
  )
}

function LeftWall(): React.JSX.Element {
  return (
    <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[20, 5]} />
      {glassMaterial}
    </mesh>
  )
}

function RightWall(): React.JSX.Element {
  return (
    <mesh position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[20, 5]} />
      {glassMaterial}
    </mesh>
  )
}
