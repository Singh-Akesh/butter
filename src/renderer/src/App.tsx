import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Room } from './components/Room'
import { Table } from './components/Table'
import { Lighting } from './components/Lighting'
import { FloorGrid } from './components/FloorGrid'
import { Chairs } from './components/Chair'
import { Characters } from './components/Character'
import { Laptops } from './components/Laptop'
import { WebcamProvider, useFaceExpressions } from './components/WebcamPreview'
import { Html } from '@react-three/drei'

function YouMarker(): React.JSX.Element {
  // Slot 0: angle=0, sin(0)=0, cos(0)=1, radius=3.2
  return (
    <Html position={[0, 3.2, 3.2 * 1.25]} center>
      <div style={{
        background: 'rgba(99,179,255,0.85)', color: '#fff',
        fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold',
        padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}>👤 YOU</div>
    </Html>
  )
}

function DebugOverlay(): React.JSX.Element {
  const e = useFaceExpressions()
  const tracking = Object.values(e).some(v => v !== 0)
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, background: 'rgba(0,0,0,0.75)',
      color: '#0f0', fontFamily: 'monospace', fontSize: 11, padding: '8px 12px',
      borderRadius: 6, zIndex: 20, lineHeight: 1.8
    }}>
      <div style={{ color: tracking ? '#0f0' : '#f55', marginBottom: 4 }}>
        {tracking ? '● TRACKING' : '○ NO FACE'}
      </div>
      <div>mouthOpen:      {e.mouthOpen.toFixed(3)}</div>
      <div>browRaiseLeft:  {e.browRaiseLeft.toFixed(3)}</div>
      <div>browRaiseRight: {e.browRaiseRight.toFixed(3)}</div>
      <div>eyeBlinkLeft:   {e.eyeBlinkLeft.toFixed(3)}</div>
      <div>eyeBlinkRight:  {e.eyeBlinkRight.toFixed(3)}</div>
      <div>headRotX:       {e.headRotX.toFixed(3)}</div>
      <div>headRotY:       {e.headRotY.toFixed(3)}</div>
      <div>headRotZ:       {e.headRotZ.toFixed(3)}</div>
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <WebcamProvider>
    <div style={{ width: '100vw', height: '100vh', background: '#e1e2ebeb' }}>
      <Canvas
        camera={{ position: [0, 3.5, 7], fov: 60 }}
        shadows
        gl={{ antialias: true }}
        style={{ background: '#c8b89a' }}
      >
        <Lighting />
        <Room />
        <Table />
        <FloorGrid />
        <Chairs />
        <Characters />
        <Laptops />
        <YouMarker />
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 1, 0]}
        />
      </Canvas>

      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 24,
          fontFamily: 'monospace',
          color: '#63b3ff',
          fontSize: 13,
          letterSpacing: 2,
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      >
        BUTTER — ROOM 001
      </div>
      <DebugOverlay />
    </div>
    </WebcamProvider>
  )
}

export default App
