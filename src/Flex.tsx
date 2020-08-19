import React, { useLayoutEffect, useMemo, useState, ReactNode } from 'react'
import Yoga from 'yoga-layout'
import { Vector3 } from 'three'
import { setYogaProperties } from './util'
import type { Axis } from './util'
import { boxContext, flexContext } from './context'

export function Flex({
  size = [1, 1, 1],
  direction = Yoga.DIRECTION_LTR,
  flexProps = {},
  mainAxis = 'x',
  crossAxis = 'y',
  children,
  position = [0, 0, 0],
  ...props
}: {
  position: [number, number, number]
  children: ReactNode
  size: [number, number, number]
  direction: Yoga.YogaDirection
  flexProps: any
  mainAxis: Axis
  crossAxis: Axis
}) {
  const [rootNode] = useState(() => Yoga.Node.create())
  useMemo(() => setYogaProperties(rootNode, flexProps), [rootNode, flexProps])

  const state = useMemo(() => {
    const sizeVec3 = new Vector3(...size)
    const depthAxis = ['x', 'y', 'z'].filter((axis) => ![mainAxis, crossAxis].includes(axis as Axis))
    const flexWidth = sizeVec3[mainAxis]
    const flexHeight = sizeVec3[crossAxis]
    const rootStart = new Vector3(...position).addScaledVector(new Vector3(size[0], size[1], size[2]), 0.5)
    return { rootNode, depthAxis, mainAxis, crossAxis, sizeVec3, flexWidth, flexHeight, rootStart }
  }, [rootNode, mainAxis, crossAxis, position, size])

  // Layouteffect because it must compute *before* its children render
  useLayoutEffect(() => {
    rootNode.calculateLayout(state.flexWidth, state.flexHeight, direction)
  }, [rootNode, children, state, direction])

  return (
    <group position={position} {...props}>
      <boxContext.Provider value={null}>
        <flexContext.Provider value={state}>{children}</flexContext.Provider>
      </boxContext.Provider>
    </group>
  )
}
