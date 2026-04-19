import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Room } from './components/Room'
import { Table } from './components/Table'
import { Lighting } from './components/Lighting'
import { FloorGrid } from './components/FloorGrid'
import { Chairs } from './components/Chair'

function App(): React.JSX.Element {
  return (
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
    </div>
  )
}

export default App
