import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Mesh } from 'three'
import { Room } from './components/Room'
import { Table } from './components/Table'
import { Lighting } from './components/Lighting'
import { FloorGrid } from './components/FloorGrid'
import { Chairs } from './components/Chair'
import { Characters } from './components/Character'
import { Laptops } from './components/Laptop'
import { WebcamProvider, useFaceExpressions } from './components/WebcamPreview'

// slot 0: x=0, z=3.2, character base y = 0.45 - 0.58*1.25 = -0.275
// torso y = 0.88*1.25 = 1.1, head y = 0.52*1.25 = 0.65 above torso => total ~1.475, hair top ~1.7
function YouHalo(): React.JSX.Element {
  const ringRef = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.08
      ringRef.current.scale.set(s, s, s)
      ringRef.current.material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.3
    }
  })
  return (
    <mesh ref={ringRef} position={[0, 2.05, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.28, 0.025, 12, 48]} />
      <meshStandardMaterial color="#63b3ff" emissive="#63b3ff" emissiveIntensity={1.5} transparent opacity={0.8} />
    </mesh>
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
  const [showPanel, setShowPanel] = useState(true)

  return (
    <WebcamProvider showPanel={showPanel}>
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
        <YouHalo />
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 1, 0]}
        />
      </Canvas>

      <div style={{
        position: 'fixed', top: 20, left: 24,
        fontFamily: 'monospace', color: '#63b3ff',
        fontSize: 13, letterSpacing: 2, opacity: 0.7, pointerEvents: 'none'
      }}>
        BUTTER — ROOM 001
      </div>

      {/* Settings gear button */}
      <button
        onClick={() => setShowPanel(p => !p)}
        style={{
          position: 'fixed', bottom: 20, left: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: showPanel ? 'rgba(99,179,255,0.9)' : 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(99,179,255,0.4)',
          color: '#fff', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 30, transition: 'background 0.2s'
        }}
        title="Toggle tracking panel"
      >
        ⚙️
      </button>

      {showPanel && <DebugOverlay />}
    </div>
    </WebcamProvider>
  )
}

export default App
