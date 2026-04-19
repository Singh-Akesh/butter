import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { FaceExpressions } from '../hooks/useFaceLandmarker'

const DEFAULT: FaceExpressions = {
  mouthOpen: 0, browRaiseLeft: 0, browRaiseRight: 0,
  eyeBlinkLeft: 0, eyeBlinkRight: 0,
  headRotX: 0, headRotY: 0, headRotZ: 0
}

const FaceContext = createContext<FaceExpressions>(DEFAULT)
export function useFaceExpressions(): FaceExpressions { return useContext(FaceContext) }

function lerp(a: number, b: number, t: number): number { return a + (b - a) * t }

export function WebcamProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [expressions, setExpressions] = useState<FaceExpressions>(DEFAULT)
  const smoothed = useRef<FaceExpressions>({ ...DEFAULT })
  const [status, setStatus] = useState('initializing...')

  useEffect(() => {
    let active = true
    let landmarker: FaceLandmarker | null = null
    let stream: MediaStream | null = null
    let rafId = 0

    async function init(): Promise<void> {
      try {
        setStatus('requesting webcam...')
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })

        const video = videoRef.current!
        video.srcObject = stream
        video.muted = true
        video.playsInline = true

        // Wait for metadata then play
        await new Promise<void>(resolve => { video.onloadedmetadata = (): void => resolve() })
        video.play().catch(console.warn)

        // Wait for actual frame dimensions
        await new Promise<void>(resolve => {
          const t = setInterval(() => {
            if (video.videoWidth > 0) { clearInterval(t); resolve() }
          }, 50)
        })
        console.log('Video ready:', video.videoWidth, 'x', video.videoHeight)
        setStatus('loading model...')

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        )
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'CPU'
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: 'VIDEO',
          numFaces: 1
        })
        console.log('Model loaded')
        setStatus('detecting...')

        function detect(): void {
          if (!active || !landmarker) return
          const video = videoRef.current!
          if (video.readyState < 2) { rafId = requestAnimationFrame(detect); return }

          const result = landmarker.detectForVideo(video, performance.now())

          if (result.faceBlendshapes?.[0]) {
            const bs = result.faceBlendshapes[0].categories
            const get = (n: string): number => bs.find(c => c.categoryName === n)?.score ?? 0

            const raw: FaceExpressions = {
              mouthOpen:      get('jawOpen'),
              browRaiseLeft:  get('browInnerUp'),
              browRaiseRight: get('browOuterUpLeft'),
              eyeBlinkLeft:   get('eyeBlinkLeft'),
              eyeBlinkRight:  get('eyeBlinkRight'),
              headRotX: 0, headRotY: 0, headRotZ: 0
            }

            if (result.facialTransformationMatrixes?.[0]) {
              const m = result.facialTransformationMatrixes[0].data
              raw.headRotX = Math.asin(-m[6])
              raw.headRotY = Math.atan2(m[2], m[10])
              raw.headRotZ = Math.atan2(m[4], m[5])
            }

            const s = smoothed.current
            smoothed.current = {
              mouthOpen:      lerp(s.mouthOpen,      raw.mouthOpen,      0.2),
              browRaiseLeft:  lerp(s.browRaiseLeft,  raw.browRaiseLeft,  0.2),
              browRaiseRight: lerp(s.browRaiseRight, raw.browRaiseRight, 0.2),
              eyeBlinkLeft:   lerp(s.eyeBlinkLeft,   raw.eyeBlinkLeft,   0.2),
              eyeBlinkRight:  lerp(s.eyeBlinkRight,  raw.eyeBlinkRight,  0.2),
              headRotX:       lerp(s.headRotX,       raw.headRotX,       0.2),
              headRotY:       lerp(s.headRotY,       raw.headRotY,       0.2),
              headRotZ:       lerp(s.headRotZ,       raw.headRotZ,       0.2),
            }
            setExpressions({ ...smoothed.current })
            setStatus('● tracking')
          } else {
            setStatus('○ no face')
          }

          rafId = requestAnimationFrame(detect)
        }

        detect()
      } catch (err) {
        const msg = err instanceof Error ? err.message : JSON.stringify(err)
        console.error('init error:', msg)
        setStatus(`error: ${msg}`)
      }
    }

    init()
    return () => {
      active = false
      cancelAnimationFrame(rafId)
      landmarker?.close()
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <FaceContext.Provider value={expressions}>
      {children}
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 160, height: 120, borderRadius: 10,
          border: '2px solid rgba(99,179,255,0.5)',
          objectFit: 'cover', zIndex: 10, background: '#000'
        }}
      />
      <div style={{
        position: 'fixed', bottom: 148, right: 20,
        fontFamily: 'monospace', fontSize: 10, zIndex: 10,
        color: status.startsWith('●') ? '#0f0' : status.startsWith('○') ? '#fa0' : '#88f'
      }}>
        {status}
      </div>
    </FaceContext.Provider>
  )
}
