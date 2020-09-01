import * as THREE from 'three'
import React, { Suspense, useMemo, useEffect, useRef } from 'react'
import { Canvas, useLoader, useThree, useFrame } from 'react-three-fiber'
import { useAspect, Html, useHelper } from 'drei'
import { Flex, Box, useReflow } from '../../src/index'
import { Text } from './Text'
import { BoxHelper } from 'three'

const state = {
  top: 0,
  pages: 2,
}

function Title() {
  const reflow = useReflow()
  useFrame(reflow)
  return (
    // <Box flexDirection="column" justify="center" alignItems="center" width="100%" height={500}>
    <Box>
      <Box margin={5}>
        <Text fontSize={50} letterSpacing={0.1}>
          REACT
        </Text>
      </Box>
      <Box margin={5}>
        <Text fontSize={50} letterSpacing={0.1}>
          THREE
        </Text>
      </Box>
      <Box margin={5}>
        <Text fontSize={50} letterSpacing={0.1}>
          FLEX
        </Text>
      </Box>
    </Box>
  )
}

function Page() {
  const group = useRef<THREE.Group>()
  const { size } = useThree()
  const [vpWidth, vpHeight] = useAspect('cover', size.width, size.height)
  const vec = new THREE.Vector3()
  useFrame(() => group.current.position.lerp(vec.set(0, state.top, 0), 0.1))
  useHelper(group, BoxHelper, 'blue')
  return (
    <group ref={group}>
      <Flex flexDirection="column" size={[vpWidth, vpHeight, 0]}>
        <Box margin={5}>
          <mesh>
            <boxBufferGeometry args={[100, 100, 100]} />
            <meshStandardMaterial />
          </mesh>
        </Box>
        <Box margin={5}>
          <mesh>
            <boxBufferGeometry args={[100, 100, 100]} />
            <meshStandardMaterial />
          </mesh>
        </Box>
        <Box margin={5}>
          <mesh>
            <boxBufferGeometry args={[100, 100, 100]} />
            <meshStandardMaterial />
          </mesh>
        </Box>

        <Title />

        {/* <Box flexDirection="row" flexWrap="wrap">
          {new Array(10).fill(0).map(() => (
            <Box margin={5}>
              <mesh>
                <boxBufferGeometry args={[50, 50, 50]} />
                <meshStandardMaterial />
              </mesh>
            </Box>
          ))}
        </Box> */}
      </Flex>
    </group>
  )
}

function Cube() {
  const mesh = useRef<THREE.Mesh>()
  const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(1, 1, 0))
  const quat2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))
  const euler = new THREE.Euler(0, 0, 0)
  useFrame(() => {
    euler.set(state.top / 1000, state.top / 1000, 0)
    quat.slerp(quat2.setFromEuler(euler), 0.1)
    mesh.current.rotation.setFromQuaternion(quat)
  })
  return (
    <mesh ref={mesh} position={[0, 0, -150]}>
      <boxBufferGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color="#272730" />
    </mesh>
  )
}

export default function App() {
  const scrollArea = useRef()
  const onScroll = (e) => (state.top = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), [])
  return (
    <>
      <Canvas
        colorManagement
        shadowMap
        onPointerMove={null}
        camera={{ position: [0, 0, 250] }}
        pixelRatio={window.devicePixelRatio}
      >
        <pointLight position={[0, 100, 400]} intensity={0.1} />
        <ambientLight intensity={0.1} />
        <spotLight
          position={[100, 100, 100]}
          penumbra={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={<Html center>loading..</Html>}>
          <Page />
          {/* <Cube /> */}
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  )
}
