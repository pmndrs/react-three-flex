import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls, useHelper } from 'drei'
import { Flex, Box, R3FlexProps, FlexPlane } from '../../src/index'
import { Mesh, BoxHelper, Group } from 'three'
import { Controls, useControl } from 'react-three-gui'

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<any>()
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    const tick = () => savedCallback.current()
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function Sphere({
  sphereWidth = 50,
  color = 'white',
  ...props
}: {
  sphereWidth?: number
  color?: string
} & R3FlexProps) {
  const mesh = useRef<Mesh>()
  useHelper(mesh, BoxHelper, 'red')
  return (
    <Box centerAnchor {...props}>
      <mesh ref={mesh}>
        <sphereBufferGeometry attach="geometry" args={[sphereWidth / 2, 64, 64]} />
        <meshLambertMaterial attach="material" color={color} />
      </mesh>
    </Box>
  )
}

function AnimatedBox({
  size = 50,
  color = 'white',
  ...props
}: {
  size?: number
  color?: string
} & R3FlexProps) {
  const mesh = useRef<Mesh>()
  useHelper(mesh, BoxHelper, 'red')
  const [state, setState] = useState(true)
  useInterval(() => setState((s) => !s), 1000)
  return (
    <Box centerAnchor {...props}>
      <mesh ref={mesh}>
        <boxBufferGeometry attach="geometry" args={[size * (state ? 2.5 : 1), size, size]} />
        <meshLambertMaterial attach="material" color={color} />
      </mesh>
    </Box>
  )
}

function Scene({ grow, shrink }: { grow: number; shrink: number }) {
  const group = useRef<Group>()
  useHelper(group, BoxHelper, '#272730')

  return (
    <group ref={group}>
      <AnimatedBox />
      <Sphere flexGrow={grow} />
      <Sphere flexShrink={shrink} />
      <Sphere sphereWidth={100} />
      <Sphere sphereWidth={75} color="darkred" />
      <Sphere color="darkgreen" />
      <Sphere />

      {/* nested flex container */}
      <Box flexDirection="column" flexWrap="no-wrap" alignItems="flex-start" justifyContent="flex-start">
        <Sphere sphereWidth={20} color="gold" />
        <Sphere sphereWidth={20} color="tomato" />
        <Sphere sphereWidth={50} color="#474750" />
      </Box>
    </group>
  )
}

const FlexDemo = () => {
  const containerWidth = useControl('containerWidth', { type: 'number', min: 50, max: 800, value: 200 })
  const plane: FlexPlane = useControl('plane', { type: 'select', items: ['xy', 'yz', 'xz'], value: 'xy' })

  const flexDirection = useControl('flexDirection', {
    type: 'select',
    items: ['row', 'row-reverse', 'column', 'column-reverse'],
    value: 'row',
  })
  const flexWrap = useControl('flexWrap', {
    type: 'select',
    items: ['no-wrap', 'wrap', 'wrap-reverse'],
    value: 'wrap',
  })
  const justifyContent = useControl('justifyContent', {
    type: 'select',
    items: ['space-evenly', 'space-around', 'space-between', 'center', 'flex-end', 'flex-start'],
    value: 'space-between',
  })
  const alignItems = useControl('alignItems', {
    type: 'select',
    items: ['flex-start', 'flex-end', 'auto', 'baseline', 'center', 'space-around', 'space-between', 'stretch'],
    value: 'center',
  })
  const grow = useControl('First item grow', { type: 'number', min: 0, max: 2, value: 0 })
  const shrink = useControl('Second item shrink', { type: 'number', min: 0, max: 10, value: 1 })

  const margin = useControl('Margin', { type: 'number', min: 0, value: 0, max: 300 })

  const padding = useControl('Padding', { type: 'number', min: 0, value: 0, max: 300 })

  const size = [200, 200, 200] as [number, number, number]
  size[{ x: 0, y: 1, z: 2 }[plane[0]]] = containerWidth

  return (
    <Flex
      onReflow={console.log}
      size={size}
      position={[-size[0] / 2, size[1] / 2, 0]}
      {...{ flexWrap, alignItems, justifyContent, plane, flexDirection, margin, padding }}
    >
      <Scene grow={grow} shrink={shrink} />
    </Flex>
  )
}

const App = () => (
  <>
    <Canvas
      colorManagement
      pixelRatio={window.devicePixelRatio}
      invalidateFrameloop
      orthographic
      camera={{ position: [0, 0, 200], zoom: 2, near: -1000, far: 1000 }}
    >
      <FlexDemo />
      <pointLight position={[200, 200, 200]} />
      <pointLight position={[-200, -200, -200]} color="red" intensity={0.5} />
      <ambientLight intensity={0.3} />
      <OrbitControls />
    </Canvas>
    <Controls />
  </>
)

export default App
