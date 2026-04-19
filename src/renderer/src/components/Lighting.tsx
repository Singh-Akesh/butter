import React from 'react'

export function Lighting(): React.JSX.Element {
  return (
    <>
      <ambientLight intensity={3} color="#ffffff" />
      <directionalLight position={[5, 8, 5]} intensity={2} castShadow />
      <pointLight position={[0, 4, 0]} intensity={1} color="#fff5e0" />
    </>
  )
}
