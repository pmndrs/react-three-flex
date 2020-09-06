import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { useGLTFLoader, Shadow, useTextureLoader } from 'drei'
import Text from './Text'

import state from '../state'

export default function Model(props) {
  const group = useRef()
  const shadow = useRef()
  const { nodes } = useGLTFLoader('/geo.min.glb', true)
  const matcap = useTextureLoader("/matcap.png")

  useFrame(({ clock }) => {
    const t = (1 + Math.sin(clock.getElapsedTime() * 1.5)) / 2
    group.current.position.y = t / 3
    shadow.current.scale.y = shadow.current.scale.z = 1 + t
    shadow.current.scale.x = (1 + t) * 1.25
    group.current.rotation.x = group.current.rotation.z += 0.005
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, state.mouse[0] / 2, 0.05)
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, state.mouse[1] / 4, 0.03)
  })

  return (
    <group {...props} dispose={null}>
      <group ref={group}>
        <mesh geometry={nodes.geo.geometry}>
          <meshMatcapMaterial matcap={matcap} />
        </mesh>
        <mesh geometry={nodes.geo.geometry}>
          <meshBasicMaterial wireframe />
        </mesh>
      </group>
      <group position={[1.25, -0.5, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.07}
          lineHeight={1}
          letterSpacing={-0.05}
          font="https://cdn.jsdelivr.net/npm/inter-ui/Inter%20(web)/Inter-Regular.woff"
        >
          03
          <meshBasicMaterial color="#cccccc" toneMapped={false} />
        </Text>
        <Text position={[-0.01, -0.1, 0]} fontSize={0.1} lineHeight={1} letterSpacing={-0.05} color="black">
          {`Pimandres,\nThe vision of Hermes`}
        </Text>
      </group>
      <Shadow ref={shadow} opacity={0.3} rotation-x={-Math.PI / 2} position={[0, -1.51, 0]} />
    </group>
  )
}
