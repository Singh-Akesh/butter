import React from 'react'
import { Grid } from '@react-three/drei'

export function FloorGrid(): React.JSX.Element {
  return (
    <Grid
      position={[0, 0.01, 0]}
      args={[20, 20]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#1a2744"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#63b3ff"
      fadeDistance={18}
      fadeStrength={1}
      infiniteGrid={false}
    />
  )
}
