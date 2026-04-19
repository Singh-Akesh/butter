import React from 'react'

export function Lighting(): React.JSX.Element {
  return (
    <>
      <ambientLight intensity={0.15} color="#1a1a3a" />

      <pointLight
        position={[0, 4.5, 0]}
        intensity={40}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <pointLight position={[-8, 2, -4]} intensity={20} color="#63b3ff" />
      <pointLight position={[8, 2, -4]} intensity={20} color="#a78bfa" />

      <directionalLight position={[0, 5, 8]} intensity={0.5} color="#ffffff" castShadow />
    </>
  )
}
