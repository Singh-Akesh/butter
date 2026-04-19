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

export function WebcamProvider({ children, showPanel }: { children: React.ReactNode; showPanel: boolean }): React.JSX.Element {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [expressions, setExpressions] = useState<FaceExpressions>(DEFAULT)
  const smoothed = useRef<FaceExpressions>({ ...DEFAULT })
  const [status, setStatus] = useState('initializing...')

  useEffect(() => {
    let active = true
    let landmarker: FaceLandmarker | null = null
    let stream: MediaStream | null = null
    let rafId = 0

    // Keep video off-screen but always rendering
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.width = 640
    video.height = 480
    video.style.position = 'fixed'
    video.style.top = '-9999px'
    video.style.left = '-9999px'
    video.style.width = '640px'
    video.style.height = '480px'
    document.body.appendChild(video)

    async function init(): Promise<void> {
      try {
        setStatus('requesting webcam...')
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        video.srcObject = stream

        await new Promise<void>(resolve => { video.onloadedmetadata = (): void => resolve() })
        await video.play()

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
        setStatus('detecting...')

        function detect(): void {
          if (!active || !landmarker) return

          // Mirror video to preview canvas every frame
          const canvas = previewCanvasRef.current
          if (canvas) {
            const ctx = canvas.getContext('2d')!
            ctx.save()
            ctx.scale(-1, 1) // mirror horizontally
            ctx.drawImage(video, -640, 0, 640, 480)
            ctx.restore()
          }

          if (video.readyState >= 2) {
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
      document.body.removeChild(video)
    }
  }, [])

  return (
    <FaceContext.Provider value={expressions}>
      {children}
      {/* Canvas preview — always rendering, just hidden when showPanel=false */}
      <canvas
        ref={previewCanvasRef}
        width={640}
        height={480}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          width: 160, height: 120, borderRadius: 10,
          border: '2px solid rgba(99,179,255,0.5)',
          zIndex: 10, background: '#000',
          visibility: showPanel ? 'visible' : 'hidden'
        }}
      />
      <div style={{
        position: 'fixed', bottom: 148, right: 20,
        fontFamily: 'monospace', fontSize: 10, zIndex: 10,
        visibility: showPanel ? 'visible' : 'hidden',
        color: status.startsWith('●') ? '#0f0' : status.startsWith('○') ? '#fa0' : '#88f'
      }}>
        {status}
      </div>
    </FaceContext.Provider>
  )
}
