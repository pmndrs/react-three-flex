import { Suspense, useCallback } from 'react'
import { Flex, Box, YogaProvider } from '@react-three/flex/dist/outerRuntime'
import Yoga from 'yoga-layout-wasm'
import YogaWasmFile from 'yoga-layout-wasm/dist/yoga.wasm?url'

function App() {
  const width = 6
  const height = 3

  const initYoga = useCallback(() => Yoga.init(YogaWasmFile), [])

  return (
    <YogaProvider initYoga={initYoga}>
      <Suspense fallback={null}>
        <Flex centerAnchor position={[0, 0, -2]} size={[width, height, 0]} flexDirection="row" flexWrap="wrap">
          {new Array(8).fill(undefined).map((_, i) => (
            <Box margin={0.3} key={i} width={1} height={1} centerAnchor>
              {(width, height) => (
                <mesh>
                  <planeBufferGeometry args={[width, height]} />
                  <meshBasicMaterial color={0x0000ff} />
                </mesh>
              )}
            </Box>
          ))}
        </Flex>
      </Suspense>
    </YogaProvider>
  )
}

export default App
