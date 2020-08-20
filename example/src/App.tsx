import React, { useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls, useHelper } from 'drei'
import { Flex, Box, FlexDirection, JustifyContent } from '../../src/index'
import { Mesh, BoxHelper, Group } from 'three'
import Yoga from 'yoga-layout-prebuilt'
import { Controls, useControl } from 'react-three-gui'
import { Axis } from '../../src/util'

function Sphere({ width = 50, color = 'white', flexProps = {} }) {
  const mesh = useRef<Mesh>()
  useHelper(mesh, BoxHelper, 'red')
  return (
    <Box flexProps={flexProps}>
      <mesh ref={mesh}>
        <sphereBufferGeometry attach="geometry" args={[width / 2, 64, 64]} />
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
      <Sphere flexProps={{ flexGrow: grow }} />
      <Sphere flexProps={{ flexShrink: shrink }} />
      <Sphere width={100} />
      <Sphere width={75} color="darkred" />
      <Sphere color="darkgreen" />
      <Sphere />
      <Box>
        {/* nested flex container */}
        <Flex flexDirection="column" flexWrap="no-wrap" size={[20, 20, 20]}>
          <Sphere width={20} color="gold" />
          <Sphere width={20} color="tomato" />
          <Sphere width={20} color="#474750" />
        </Flex>
      </Box>
    </group>
  )
}

const FlexDemo = () => {
  const containerWidth = useControl('containerWidth', { type: 'number', min: 50, max: 500, value: 200 })
  const mainAxis: Axis = useControl('mainAxis', { type: 'select', items: ['x', 'y', 'z'], value: 'x' })
  const crossAxis: Axis = useControl('crossAxis', { type: 'select', items: ['x', 'y', 'z'], value: 'y' })

  const flexDirection = useControl('flexDirection', {
    type: 'select',
    items: ['row', 'row-reverse', 'column', 'column-reverse'],
    value: 'row',
  })
  const flexWrap = useControl('flexWrap', {
    type: 'select',
    items: ['WRAP_NO_WRAP', 'WRAP_WRAP', 'WRAP_WRAP_REVERSE'],
    value: 'WRAP_WRAP',
  })
  const justifyContent = useControl('justifyContent', {
    type: 'select',
    items: ['space-evenly', 'space-around', 'space-between', 'center', 'flex-end', 'flex-start'],
    value: 'space-between',
  })
  const alignItems = useControl('alignItems', {
    type: 'select',
    items: ['ALIGN_FLEX_START', 'ALIGN_FLEX_END', 'ALIGN_AUTO', 'ALIGN_BASELINE', 'ALIGN_CENTER', 'ALIGN_SPACE_AROUND', 'ALIGN_SPACE_BETWEEN', 'ALIGN_STRETCH'],
    value: 'ALIGN_CENTER',
  })
  const grow = useControl('First item grow', { type: 'number', min: 0, max: 2, value: 0 })
  const shrink = useControl('Second item shrink', { type: 'number', min: 0, max: 10, value: 1 })

  return (
    <Flex size={[containerWidth, 200, 200]} {...{ flexWrap, alignItems, justifyContent, mainAxis, crossAxis, flexDirection }}>
      <Scene grow={grow} shrink={shrink} />
    </Flex>
  )
}

const App = () => (
  <>
    <Canvas colorManagement pixelRatio={window.devicePixelRatio} invalidateFrameloop orthographic camera={{ position: [0, 0, 200], zoom: 2 }}>
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
