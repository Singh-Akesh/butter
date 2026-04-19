import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh } from 'three'
import { FaceExpressions } from '../hooks/useFaceLandmarker'
import { useFaceExpressions } from './WebcamPreview'

interface CharacterProps {
  position: [number, number, number]
  rotY: number
  skinColor: string
  shirtColor: string
  hairColor: string
  offset: number
  typing: boolean
  expressions?: FaceExpressions
}

interface HeadProps {
  skinColor: string
  hairColor: string
  expressions?: FaceExpressions
}

function Head({ skinColor, hairColor, expressions }: HeadProps): React.JSX.Element {
  const jawRef = useRef<Group>(null)
  const leftEyelidRef = useRef<Mesh>(null)
  const rightEyelidRef = useRef<Mesh>(null)
  const leftBrowRef = useRef<Mesh>(null)
  const rightBrowRef = useRef<Mesh>(null)
  const leftEyeRef = useRef<Mesh>(null)
  const rightEyeRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Jaw open from mouthOpen expression
    if (jawRef.current) {
      const open = expressions?.mouthOpen ?? 0
      jawRef.current.position.y = -0.07 - open * 0.06
      jawRef.current.rotation.x = open * 0.3
    }

    // Eyelids — blink from expression or procedural blink every ~4s
    const blinkL = expressions
      ? expressions.eyeBlinkLeft
      : Math.max(0, Math.sin(t * 0.5) > 0.97 ? 1 : 0)
    const blinkR = expressions
      ? expressions.eyeBlinkRight
      : blinkL

    if (leftEyelidRef.current) leftEyelidRef.current.scale.y = 1 - blinkL * 0.95
    if (rightEyelidRef.current) rightEyelidRef.current.scale.y = 1 - blinkR * 0.95

    // Eyebrows raise
    const browL = expressions?.browRaiseLeft ?? 0
    const browR = expressions?.browRaiseRight ?? 0
    if (leftBrowRef.current) leftBrowRef.current.position.y = 0.085 + browL * 0.04
    if (rightBrowRef.current) rightBrowRef.current.position.y = 0.085 + browR * 0.04

    // Eye pupils subtle movement
    if (leftEyeRef.current) {
      leftEyeRef.current.position.x = -0.072 + Math.sin(t * 0.3) * 0.004
      leftEyeRef.current.position.y = 0.04 + Math.sin(t * 0.2) * 0.003
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x = 0.072 + Math.sin(t * 0.3) * 0.004
      rightEyeRef.current.position.y = 0.04 + Math.sin(t * 0.2) * 0.003
    }
  })

  return (
    <group>
      {/* Skull */}
      <mesh castShadow>
        <sphereGeometry args={[0.19, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>
      {/* Cheeks / face width */}
      <mesh position={[0, -0.02, 0.04]} castShadow>
        <sphereGeometry args={[0.165, 24, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>
      {/* Forehead */}
      <mesh position={[0, 0.1, 0.06]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.55} />
      </mesh>

      {/* ── JAW (animated) ── */}
      <group ref={jawRef} position={[0, -0.07, 0.02]}>
        <mesh castShadow>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color={skinColor} roughness={0.55} />
        </mesh>
        {/* Lower lip */}
        <mesh position={[0, 0.01, 0.12]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#b56a5a" roughness={0.4} />
        </mesh>
      </group>

      {/* Upper lip */}
      <mesh position={[0, -0.055, 0.175]}>
        <boxGeometry args={[0.075, 0.018, 0.01]} />
        <meshStandardMaterial color="#c47a6a" roughness={0.4} />
      </mesh>
      {/* Philtrum */}
      <mesh position={[0, -0.03, 0.182]}>
        <boxGeometry args={[0.025, 0.022, 0.008]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Nose bridge */}
      <mesh position={[0, 0.04, 0.182]} rotation={[0.15, 0, 0]}>
        <capsuleGeometry args={[0.014, 0.06, 8, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.01, 0.192]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[-0.022, -0.022, 0.183]}>
        <sphereGeometry args={[0.016, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.022, -0.022, 0.183]}>
        <sphereGeometry args={[0.016, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* ── EYES ── */}
      {/* Left eye white */}
      <mesh position={[-0.072, 0.04, 0.162]}>
        <sphereGeometry args={[0.034, 16, 16]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.05} />
      </mesh>
      {/* Right eye white */}
      <mesh position={[0.072, 0.04, 0.162]}>
        <sphereGeometry args={[0.034, 16, 16]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.05} />
      </mesh>
      {/* Left iris */}
      <mesh ref={leftEyeRef} position={[-0.072, 0.04, 0.191]}>
        <sphereGeometry args={[0.02, 14, 14]} />
        <meshStandardMaterial color="#3a5a8a" roughness={0.05} metalness={0.1} />
      </mesh>
      {/* Right iris */}
      <mesh ref={rightEyeRef} position={[0.072, 0.04, 0.191]}>
        <sphereGeometry args={[0.02, 14, 14]} />
        <meshStandardMaterial color="#3a5a8a" roughness={0.05} metalness={0.1} />
      </mesh>
      {/* Left pupil */}
      <mesh position={[-0.072, 0.04, 0.196]}>
        <sphereGeometry args={[0.01, 10, 10]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      {/* Right pupil */}
      <mesh position={[0.072, 0.04, 0.196]}>
        <sphereGeometry args={[0.01, 10, 10]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      {/* Eye shine */}
      <mesh position={[-0.066, 0.046, 0.198]}>
        <sphereGeometry args={[0.004, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.078, 0.046, 0.198]}>
        <sphereGeometry args={[0.004, 6, 6]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* ── EYELIDS (animated) ── */}
      <mesh ref={leftEyelidRef} position={[-0.072, 0.048, 0.188]}>
        <sphereGeometry args={[0.028, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>
      <mesh ref={rightEyelidRef} position={[0.072, 0.048, 0.188]}>
        <sphereGeometry args={[0.028, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* ── EYEBROWS (animated) ── */}
      <mesh ref={leftBrowRef} position={[-0.072, 0.085, 0.175]} rotation={[0.2, 0.08, 0.12]}>
        <capsuleGeometry args={[0.007, 0.05, 6, 8]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.072, 0.085, 0.175]} rotation={[0.2, -0.08, -0.12]}>
        <capsuleGeometry args={[0.007, 0.05, 6, 8]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.192, 0.0, 0.01]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.192, 0.0, 0.01]}>
        <sphereGeometry args={[0.038, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Inner ear */}
      <mesh position={[-0.198, 0.0, 0.01]}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshStandardMaterial color="#c4907a" roughness={0.7} />
      </mesh>
      <mesh position={[0.198, 0.0, 0.01]}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshStandardMaterial color="#c4907a" roughness={0.7} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.1, -0.02]} castShadow>
        <sphereGeometry args={[0.197, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
      <mesh position={[-0.16, 0.02, 0.0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.16, 0.02, 0.0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
      {/* Hair front */}
      <mesh position={[0, 0.18, 0.1]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={hairColor} roughness={0.95} />
      </mesh>
    </group>
  )
}

function Character({ position, rotY, skinColor, shirtColor, hairColor, offset, typing, expressions }: CharacterProps): React.JSX.Element {
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
      if (expressions) {
        headRef.current.rotation.x = expressions.headRotX * 0.8
        headRef.current.rotation.y = -expressions.headRotY * 0.8
        headRef.current.rotation.z = expressions.headRotZ * 0.8
      } else {
        headRef.current.rotation.x = typing ? -0.35 + Math.sin(t * 0.4) * 0.04 : -0.05 + Math.sin(t * 0.28) * 0.04
        headRef.current.rotation.y = typing ? Math.sin(t * 0.2) * 0.05 : Math.sin(t * 0.35) * 0.1
      }
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = typing ? Math.PI / 1.8 + Math.sin(t * 8) * 0.06 : Math.PI / 2.3 + Math.sin(t * 0.5) * 0.02
      leftArmRef.current.rotation.z = typing ? 0.05 : 0.12
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = typing ? Math.PI / 1.8 + Math.sin(t * 8 + 0.5) * 0.06 : Math.PI / 2.3 + Math.sin(t * 0.5 + 1) * 0.02
      rightArmRef.current.rotation.z = typing ? -0.05 : -0.12
    }
  })

  const pantsColor = '#1a2035'
  const shoeColor = '#111111'
  const lapelColor = '#f0f0f0'

  return (
    <group position={position} rotation={[0, rotY, 0]} scale={1.25}>
      {/* Legs */}
      <mesh position={[-0.12, 0.58, 0.22]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.12, 0.58, 0.22]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.075, 0.32, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      <mesh position={[-0.12, 0.3, 0.5]} rotation={[-Math.PI / 5.5, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.12, 0.3, 0.5]} rotation={[-Math.PI / 5.5, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      <mesh position={[-0.12, 0.1, 0.68]} rotation={[-0.15, 0, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.18, 8, 12]} />
        <meshStandardMaterial color={shoeColor} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.68]} rotation={[-0.15, 0, 0]} castShadow>
        <capsuleGeometry args={[0.055, 0.18, 8, 12]} />
        <meshStandardMaterial color={shoeColor} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Torso */}
      <group ref={torsoRef} position={[0, 0.88, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.19, 0.38, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <capsuleGeometry args={[0.21, 0.08, 8, 16]} />
          <meshStandardMaterial color={shirtColor} roughness={0.75} />
        </mesh>
        <mesh position={[-0.07, 0.2, 0.17]} rotation={[0.2, 0.3, 0.1]}>
          <boxGeometry args={[0.08, 0.18, 0.02]} />
          <meshStandardMaterial color={lapelColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.07, 0.2, 0.17]} rotation={[0.2, -0.3, -0.1]}>
          <boxGeometry args={[0.08, 0.18, 0.02]} />
          <meshStandardMaterial color={lapelColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.1, 0.19]}>
          <boxGeometry args={[0.04, 0.28, 0.015]} />
          <meshStandardMaterial color="#8b1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.24, 0.195]}>
          <boxGeometry args={[0.05, 0.04, 0.02]} />
          <meshStandardMaterial color="#8b1a1a" roughness={0.4} />
        </mesh>

        {/* Left arm */}
        <group ref={leftArmRef} position={[-0.26, 0.1, 0]} rotation={[Math.PI / 2.3, 0, 0.12]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.065, 0.26, 8, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.75} />
          </mesh>
          <mesh position={[-0.02, -0.28, 0.12]} rotation={[-0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.24, 8, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          <mesh position={[-0.03, -0.32, 0.32]} castShadow>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* Right arm */}
        <group ref={rightArmRef} position={[0.26, 0.1, 0]} rotation={[Math.PI / 2.3, 0, -0.12]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.065, 0.26, 8, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.75} />
          </mesh>
          <mesh position={[0.02, -0.28, 0.12]} rotation={[-0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.24, 8, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.03, -0.32, 0.32]} castShadow>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.1, 8, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.55} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 0.52, 0]}>
          <Head skinColor={skinColor} hairColor={hairColor} expressions={expressions} />
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
  const faceExpressions = useFaceExpressions()

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
            expressions={i === 0 ? faceExpressions : undefined}
          />
        )
      })}
    </group>
  )
}
