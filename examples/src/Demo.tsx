import * as THREE from 'three'
import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { useAspect, Html } from 'drei'
import { Flex, Box, useReflow } from '../../src/index'
import { Text } from './Text'

const state = {
  top: 0,
  pages: 2,
}

function Reflower() {
  const reflow = useReflow()
  useFrame(reflow)
  return null
}

function Title({ width, height }) {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" width="100%" height="100%">
      <Box margin={0.05}>
        <Text fontSize={0.5} letterSpacing={0.1}>
          REACT
          <meshStandardMaterial />
        </Text>
      </Box>
      <Box margin={0.05}>
        <Text fontSize={0.5} letterSpacing={0.1}>
          THREE
          <meshStandardMaterial />
        </Text>
      </Box>
      <Box margin={0.05}>
        <Text fontSize={0.5} letterSpacing={0.1}>
          FLEX
          <meshStandardMaterial />
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
  useFrame(() => group.current.position.lerp(vec.set(0, state.top / 100, 0), 0.1))
  return (
    <group ref={group}>
      <Flex flexDirection="column" size={[vpWidth, vpHeight, 0]}>
        <Reflower />

        <Title width={vpWidth} height={vpHeight} />

        <Box flexDirection="row" alignItems="center" justifyContent="center" flexWrap="wrap" width="100%">
          <Box margin={0.05}>
            <mesh position={[2.5 / 2, -1, 0]}>
              <planeBufferGeometry args={[2.5, 2]} />
              <meshStandardMaterial color={['#2d4059', '#ea5455', '#decdc3', '#e5e5e5'][0 % 4]} />
            </mesh>
            <Box flexDirection="column" padding={0.1}>
              <Box marginBottom={0.1} marginLeft={0.05}>
                <Text fontSize={0.2} letterSpacing={0.1}>
                  OUR PRODUCTS
                  <meshStandardMaterial />
                </Text>
              </Box>
              <Box flexDirection="row" flexWrap="wrap" width={200} flexGrow={1}>
                {new Array(8).fill(0).map((k, i) => (
                  <Box margin={0.05}>
                    <mesh position={[0.3 / 2, -0.3 / 2, 0]}>
                      <planeBufferGeometry args={[0.3, 0.3]} />
                      <meshStandardMaterial />
                    </mesh>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box margin={0.05}>
            <mesh position={[2.5 / 2, -1, 0]}>
              <planeBufferGeometry args={[2.5, 2]} />
              <meshStandardMaterial color={['#2d4059', '#ea5455', '#decdc3', '#e5e5e5'][1 % 4]} />
            </mesh>
            <Box flexDirection="column" padding={0.1}>
              <Box marginBottom={0.1} marginLeft={0.05}>
                <Text fontSize={0.2} letterSpacing={0.1}>
                  OUR SERVICES
                  <meshStandardMaterial />
                </Text>
              </Box>
              <Box flexDirection="row" flexWrap="wrap" width={200} flexGrow={1}>
                {new Array(8).fill(0).map((k, i) => (
                  <Box margin={0.05}>
                    <mesh position={[0.3 / 2, -0.3 / 2, 0]}>
                      <planeBufferGeometry args={[0.3, 0.3]} />
                      <meshStandardMaterial />
                    </mesh>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box height={100} />

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          width="100%"
          // width="70%"
        >
          {new Array(15).fill(0).map((k, i) => (
            <Box margin={0.05} key={i}>
              <mesh position={[0.5, -0.5, 0]}>
                <planeBufferGeometry args={[1, 1]} />
                <meshStandardMaterial color={['#2d4059', '#ea5455', '#decdc3', '#e5e5e5'][i % 4]} />
              </mesh>
            </Box>
          ))}
        </Box>
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
    <mesh ref={mesh} position={[0, 0, -1.5]}>
      <boxBufferGeometry args={[1, 1, 1]} />
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
        camera={{ position: [0, 0, 2], zoom: 1 }}
        // orthographic
        pixelRatio={window.devicePixelRatio}
      >
        <pointLight position={[0, 1, 4]} intensity={0.1} />
        <ambientLight intensity={0.1} />
        <spotLight
          position={[1, 1, 1]}
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
