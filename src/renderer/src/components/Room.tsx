import React from 'react'

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
      <meshStandardMaterial color="#0d0f1c" roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

function Ceiling(): React.JSX.Element {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#0a0b16" roughness={1} />
    </mesh>
  )
}

function BackWall(): React.JSX.Element {
  return (
    <mesh position={[0, 2.5, -8]} receiveShadow>
      <planeGeometry args={[20, 5]} />
      <meshStandardMaterial color="#0d0f1c" roughness={0.9} />
    </mesh>
  )
}

function LeftWall(): React.JSX.Element {
  return (
    <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[20, 5]} />
      <meshStandardMaterial color="#0b0d1a" roughness={0.9} />
    </mesh>
  )
}

function RightWall(): React.JSX.Element {
  return (
    <mesh position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[20, 5]} />
      <meshStandardMaterial color="#0b0d1a" roughness={0.9} />
    </mesh>
  )
}
