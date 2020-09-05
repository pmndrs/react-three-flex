import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { Canvas, useThree, useFrame, useLoader } from 'react-three-fiber'
import { Flex, Box } from 'react-three-flex'
import { useAspect } from 'drei'
import Effects from './components/Effects'
import Text from './components/Text'
import Loader from './components/Loader'
import Geo from './components/Geo'
import state from './state'

function Title({ text, tag, images, left = false }) {
  const textures = useLoader(THREE.TextureLoader, images)
  return (
    <Box
      flexDirection="column"
      alignItems={left ? 'flex-start' : 'flex-end'}
      justifyContent="flex-start"
      width="100%"
      height="100%"
    >
      <Box flexDirection="row" width="100%" justifyContent={left ? 'flex-end' : 'flex-start'} margin={0}>
        {textures.map((texture, index) => (
          <Box key={index} centerAnchor margin={1} marginLeft={left * 1} marginRight={!left * 1}>
            <mesh>
              <planeBufferGeometry args={[6, 6]} />
              <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
          </Box>
        ))}
      </Box>
      <Box marginLeft={1} marginRight={1} marginTop={2}>
        <Text
          position={[left ? 1.2 : -1.2, 0.4, 1]}
          fontSize={2}
          lineHeight={0.8}
          letterSpacing={-0.06}
          font="/AirbnbCerealLight.woff"
        >
          {tag}
          <meshBasicMaterial color="#cccccc" toneMapped={false} />
        </Text>
      </Box>
      <Box marginLeft={left ? 1.6 : 1} marginRight={left ? 1 : 1.6} marginBottom={1}>
        <Text
          position-z={0.5}
          textAlign={left ? 'left' : 'right'}
          fontSize={2}
          lineHeight={0.8}
          letterSpacing={-0.06}
          color="black"
        >
          {text}
        </Text>
      </Box>
    </Box>
  )
}

function DepthLayerCard({ depth, boxWidth, boxHeight, text, textColor, color, map }) {
  const ref = useRef()
  const { size } = useThree()
  const pageLerp = useRef(state.top / size.height)
  useFrame(() => {
    const page = (pageLerp.current = THREE.MathUtils.lerp(pageLerp.current, state.top / size.height, 0.2))
    if (depth >= 0) ref.current.material.opacity = page < state.threshold * 1.7 ? 1 : 1 - (page - state.threshold * 1.7)
  })
  return (
    <>
      <mesh ref={ref} position={[boxWidth / 2, -boxHeight / 2, depth]}>
        <planeBufferGeometry args={[boxWidth, boxHeight]} />
        <meshBasicMaterial color={color} map={map} transparent opacity={1} />
      </mesh>
      <Text
        position={[0.09 + boxWidth / 2, 0.0565 + -boxHeight / 2, depth + 0.8]}
        maxWidth={boxWidth}
        anchorX="center"
        anchorY="middle"
        textAlign="left"
        fontSize={0.7}
        lineHeight={0.8}
        letterSpacing={-0.05}
        color={textColor}
      >
        {text}
      </Text>
    </>
  )
}

function DepthBox() {
  const [boxWidth, boxHeight] = useAspect('cover', 1920, 1280, 0.5)
  const img = useLoader(THREE.TextureLoader, state.depthimg)
  return (
    <Box flexDirection="row" width="100%" height="100%" alignItems="center" justifyContent="center">
      <Box>
        {state.depthbox.map((props, index) => (
          <DepthLayerCard
            key={index}
            {...props}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            map={props.depth < 0 ? img : null}
          />
        ))}
      </Box>
    </Box>
  )
}

function Content({ onReflow }) {
  const group = useRef()
  const { viewport, size, gl } = useThree()
  const vec = new THREE.Vector3()
  const pageLerp = useRef(state.top / size.height)
  useFrame(() => {
    const page = (pageLerp.current = THREE.MathUtils.lerp(pageLerp.current, state.top / size.height, 0.2))
    const y = page * viewport.height
    const sticky = state.threshold * viewport.height
    gl.setClearColor(page > state.threshold * 1.4 ? 'black' : '#f5f5f5')
    group.current.position.lerp(
      vec.set(0, page < state.threshold ? y : sticky, page < state.threshold ? 0 : page * 1.2),
      0.1
    )
  })
  const handleReflow = useCallback((w, h) => onReflow((state.pages = h / viewport.height + 5)), [
    onReflow,
    viewport.height,
  ])
  return (
    <group ref={group}>
      <Flex flexDirection="column" size={[viewport.width, viewport.height, 0]} onReflow={handleReflow}>
        {state.content.map((props, index) => (
          <Title key={index} left={!(index % 2)} {...props} />
        ))}
        <Box flexDirection="column" alignItems={'center'} justifyContent="center" width="100%" height="100%">
          <Box centerAnchor>
            <Geo scale={[4, 4, 4]} />
          </Box>
        </Box>
        <DepthBox />
      </Flex>
    </group>
  )
}

export default function App() {
  const scrollArea = useRef()
  const onScroll = (e) => (state.top = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), [])
  const [pages, setPages] = useState(0)
  return (
    <>
      <Canvas
        concurrent
        colorManagement
        shadowMap
        noEvents
        pixelRatio={1}
        camera={{ position: [0, 0, 10] }}
        gl={{ powerPreference: 'high-performance', alpha: false, antialias: false, stencil: false, depth: false }}
      >
        <spotLight
          castShadow
          angle={0.3}
          penumbra={1}
          position={[10, 10, 20]}
          intensity={4}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -10]} color="white" />
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <Content onReflow={setPages} />
        </Suspense>
        <Effects />
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{ height: `${pages * 100}vh` }} />
      </div>
      <Loader />
    </>
  )
}
