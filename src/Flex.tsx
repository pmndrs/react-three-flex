import React, { useLayoutEffect, useMemo, useState, ReactNode } from 'react'
import Yoga from 'yoga-layout'
import { Vector3 } from 'three'
import { setYogaProperties, rmUndefFromObj } from './util'

import { boxContext, flexContext } from './context'

import type { Axis } from './util'
import type { YogaFlexProps } from './props'

type FlexProps = Partial<{
  position: [number, number, number]
  children: ReactNode
  size: [number, number, number]
  /**
   * Direction - right to left or right to left
   */
  direction: Yoga.YogaDirection
  mainAxis: Axis
  crossAxis: Axis
}> &
  YogaFlexProps

/**
 * Flex container. Can contain <Box />'es or other <Flex />'es
 */
export function Flex({
  // Non flex props
  size = [1, 1, 1],
  direction = Yoga.DIRECTION_LTR,
  mainAxis = 'x',
  crossAxis = 'y',
  children,
  position = [0, 0, 0],

  flexDirection,
  flexDir,
  dir,

  alignContent,
  alignItems,
  alignSelf,
  align,

  justifyContent,
  justify,

  flexBasis,
  flexGrow,
  flexShrink,

  flexWrap,
  wrap,

  margin,
  padding,

  height,
  width,

  maxHeight,
  maxWidth,
  minHeight,
  minWidth,

  ...props
}: FlexProps) {
  const flexProps: YogaFlexProps = {
    flexDirection,
    flexDir,
    dir,

    alignContent,
    alignItems,
    alignSelf,
    align,

    justifyContent,
    justify,

    flexBasis,
    flexGrow,
    flexShrink,

    flexWrap,
    wrap,

    margin,
    padding,

    height,
    width,

    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
  }

  // Remove undefined properties
  rmUndefFromObj(flexProps)

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

  // Layout effect because it must compute *before* its children render
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
