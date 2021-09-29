import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { YogaPrebuiltProvider } from '../src'

export function Setup({
  children,
  cameraFov = 75,
  cameraPosition = new THREE.Vector3(0, 0, 5),
  controls = true,
  lights = false,
  ...restProps
}: {
  children: React.ReactNode | React.ReactNode[]
  cameraFov?: number
  cameraPosition?: THREE.Camera['position']
  controls?: boolean
  lights?: boolean
}) {
  return (
    <Canvas shadows camera={{ position: cameraPosition, fov: cameraFov }} dpr={window.devicePixelRatio} {...restProps}>
      <Suspense fallback={null}>
        <YogaPrebuiltProvider>{children}</YogaPrebuiltProvider>
      </Suspense>
      {lights && (
        <>
          <ambientLight intensity={0.8} />
          <pointLight intensity={1} position={[0, 6, 0]} />
        </>
      )}
      {controls && <OrbitControls />}
    </Canvas>
  )
}
