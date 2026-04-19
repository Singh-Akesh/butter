import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Group } from 'three'

const AVATAR_URL = '/src/assets/avatar.glb'
const SITTING_IDLE_URL = '/src/assets/sitting-idle.glb'

export function Avatar(): React.JSX.Element {
  const group = useRef<Group>(null)

  const { scene } = useGLTF(AVATAR_URL)
  const { animations } = useGLTF(SITTING_IDLE_URL)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const action = Object.values(actions)[0]
    if (action) {
      action.reset().fadeIn(0.3).play()
    }
    return () => {
      action?.fadeOut(0.3)
    }
  }, [actions])

  return (
    <group ref={group} position={[0, -0.1, 3.2]} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(AVATAR_URL)
useGLTF.preload(SITTING_IDLE_URL)
