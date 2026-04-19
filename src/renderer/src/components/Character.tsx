import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface CharacterProps {
  position: [number, number, number]
  rotY: number
  skinColor: string
  shirtColor: string
  hairColor: string
  offset: number
  typing: boolean
}

function Head({ skinColor, hairColor }: { skinColor: string; hairColor: string }): React.JSX.Element {
  return (
    <group>
      {/* Skull — slightly elongated */}
      <mesh castShadow>
        <sphereGeometry args={[0.19, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>
      {/* Jaw — widen lower face */}
      <mesh position={[0, -0.07, 0.02]} castShadow>
        <sphereGeometry args={[0.155, 24, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>

      {/* Forehead flatten */}
      <mesh position={[0, 0.1, 0.06]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.01, 0.185]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.04, 0.178]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Eyes — white sclera */}
      <mesh position={[-0.072, 0.04, 0.165]}>
        <sphereGeometry args={[0.033, 16, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.1} />
      </mesh>
      <mesh position={[0.072, 0.04, 0.165]}>
        <sphereGeometry args={[0.033, 16, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.1} />
      </mesh>
      {/* Iris */}
      <mesh position={[-0.072, 0.04, 0.193]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#3a5a8a" roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[0.072, 0.04, 0.193]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color="#3a5a8a" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Pupil */}
      <mesh position={[-0.072, 0.04, 0.197]}>
        <sphereGeometry args={[0.009, 8, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0.072, 0.04, 0.197]}>
        <sphereGeometry args={[0.009, 8, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.072, 0.085, 0.175]} rotation={[0.2, 0.1, 0.15]}>
        <boxGeometry args={[0.055, 0.01, 0.012]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.072, 0.085, 0.175]} rotation={[0.2, -0.1, -0.15]}>
        <boxGeometry args={[0.055, 0.01, 0.012]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Lips */}
      <mesh position={[0, -0.075, 0.178]}>
        <boxGeometry args={[0.07, 0.014, 0.01]} />
        <meshStandardMaterial color="#c47a6a" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.092, 0.175]}>
        <boxGeometry args={[0.06, 0.012, 0.01]} />
        <meshStandardMaterial color="#b56a5a" roughness={0.5} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.19, 0.0, 0.01]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.19, 0.0, 0.01]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.09, -0.02]} castShadow>
        <sphereGeometry args={[0.196, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
      {/* Side hair */}
      <mesh position={[-0.16, 0.02, 0.0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.16, 0.02, 0.0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
    </group>
  )
}

function Character({ position, rotY, skinColor, shirtColor, hairColor, offset, typing }: CharacterProps): React.JSX.Element {
  const torsoRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset
    if (torsoRef.current) {
      torsoRef.current.scale.y = 1 + Math.sin(t * 1.1) * 0.012
      torsoRef.current.position.y = 0.88 + Math.sin(t * 1.1) * 0.004
    }
    if (headRef.current) {
      // Typing: head tilted down looking at screen; idle: gentle sway
      headRef.current.rotation.x = typing
        ? -0.35 + Math.sin(t * 0.4) * 0.04
        : -0.05 + Math.sin(t * 0.28) * 0.04
      headRef.current.rotation.y = typing ? Math.sin(t * 0.2) * 0.05 : Math.sin(t * 0.35) * 0.1
    }
    if (leftArmRef.current) {
      // Typing: arms forward on keyboard with finger tap
      leftArmRef.current.rotation.x = typing
        ? Math.PI / 1.8 + Math.sin(t * 8) * 0.06
        : Math.PI / 2.3 + Math.sin(t * 0.5) * 0.02
      leftArmRef.current.rotation.z = typing ? 0.05 : 0.12
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = typing
        ? Math.PI / 1.8 + Math.sin(t * 8 + 0.5) * 0.06
        : Math.PI / 2.3 + Math.sin(t * 0.5 + 1) * 0.02
      rightArmRef.current.rotation.z = typing ? -0.05 : -0.12
    }
  })

  const pantsColor = '#1a2035'
  const shoeColor = '#111111'
  const lapelColor = '#f0f0f0'

  return (
    <group position={position} rotation={[0, rotY, 0]} scale={1.25}>

      {/* ── LEGS ── */}
      {/* Left thigh */}
      <mesh position={[-0.12, 0.58, 0.22]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      {/* Right thigh */}
      <mesh position={[0.12, 0.58, 0.22]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      {/* Left shin */}
      <mesh position={[-0.12, 0.3, 0.5]} rotation={[-Math.PI / 5.5, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      {/* Right shin */}
      <mesh position={[0.12, 0.3, 0.5]} rotation={[-Math.PI / 5.5, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.12, 0.1, 0.68]} rotation={[-0.15, 0, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.18, 8, 12]} />
        <meshStandardMaterial color={shoeColor} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.68]} rotation={[-0.15, 0, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.18, 8, 12]} />
        <meshStandardMaterial color={shoeColor} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* ── TORSO ── */}
      <group ref={torsoRef} position={[0, 0.88, 0]}>
        {/* Main jacket body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.19, 0.38, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        {/* Shoulder width */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <capsuleGeometry args={[0.21, 0.08, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>

        {/* Left lapel */}
        <mesh position={[-0.07, 0.2, 0.17]} rotation={[0.2, 0.3, 0.1]}>
          <boxGeometry args={[0.08, 0.18, 0.02]} />
          <meshStandardMaterial color={lapelColor} roughness={0.5} />
        </mesh>
        {/* Right lapel */}
        <mesh position={[0.07, 0.2, 0.17]} rotation={[0.2, -0.3, -0.1]}>
          <boxGeometry args={[0.08, 0.18, 0.02]} />
          <meshStandardMaterial color={lapelColor} roughness={0.5} />
        </mesh>
        {/* Tie */}
        <mesh position={[0, 0.1, 0.19]}>
          <boxGeometry args={[0.04, 0.28, 0.015]} />
          <meshStandardMaterial color="#8b1a1a" roughness={0.4} />
        </mesh>
        {/* Tie knot */}
        <mesh position={[0, 0.24, 0.195]}>
          <boxGeometry args={[0.05, 0.04, 0.02]} />
          <meshStandardMaterial color="#8b1a1a" roughness={0.4} />
        </mesh>

        {/* ── LEFT ARM ── */}
        <group ref={leftArmRef} position={[-0.26, 0.1, 0]} rotation={[Math.PI / 2.3, 0, 0.12]}>
          {/* Upper arm */}
          <mesh castShadow>
            <capsuleGeometry args={[0.065, 0.26, 8, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.75} />
          </mesh>
          {/* Forearm */}
          <mesh position={[-0.02, -0.28, 0.12]} rotation={[-0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.24, 8, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[-0.03, -0.32, 0.32]} castShadow>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* ── RIGHT ARM ── */}
        <group ref={rightArmRef} position={[0.26, 0.1, 0]} rotation={[Math.PI / 2.3, 0, -0.12]}>
          {/* Upper arm */}
          <mesh castShadow>
            <capsuleGeometry args={[0.065, 0.26, 8, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.75} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.02, -0.28, 0.12]} rotation={[-0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.24, 8, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0.03, -0.32, 0.32]} castShadow>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* ── NECK ── */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.1, 8, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.55} />
        </mesh>

        {/* ── HEAD ── */}
        <group ref={headRef} position={[0, 0.52, 0]}>
          <Head skinColor={skinColor} hairColor={hairColor} />
        </group>
      </group>
    </group>
  )
}

const CHARACTERS = [
  { skinColor: '#f5c5a3', shirtColor: '#1e2d4a', hairColor: '#1a0f0a' },
  { skinColor: '#8d5524', shirtColor: '#1a3a28', hairColor: '#0a0a0a' },
  { skinColor: '#fddbb4', shirtColor: '#3a2a4a', hairColor: '#8b4513' },
  { skinColor: '#c68642', shirtColor: '#2a1a1a', hairColor: '#2c1810' },
  { skinColor: '#f5c5a3', shirtColor: '#1e3a2a', hairColor: '#4a3020' },
  { skinColor: '#d4956a', shirtColor: '#1a2a3a', hairColor: '#0a0a0a' },
]

export function Characters(): React.JSX.Element {
  const count = 6
  const radius = 3.2

  return (
    <group>
      {CHARACTERS.map((c, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return (
          <Character
            key={i}
            position={[x, 0.45 - 0.58 * 1.25, z]}
            rotY={angle + Math.PI}
            skinColor={c.skinColor}
            shirtColor={c.shirtColor}
            hairColor={c.hairColor}
            offset={i * 1.3}
            typing={i % 2 === 0}
          />
        )
      })}
    </group>
  )
}
