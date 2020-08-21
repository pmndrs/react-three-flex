import React, { useLayoutEffect, useMemo, useState } from 'react'
import Yoga from 'yoga-layout-prebuilt'
import { Vector3 } from 'three'
import { setYogaProperties, rmUndefFromObj } from './util'

import { boxContext, flexContext } from './context'

import type { Axis } from './util'
import type { R3FlexProps } from './props'

type FlexProps = Partial<{
  position: [number, number, number]
  children: any
  size: [number, number, number]
  /**
   * Direction - right to left or right to left
   */
  direction: Yoga.YogaDirection | 'ltr' | 'rtl'
  mainAxis: Axis
  crossAxis: Axis
}> &
  R3FlexProps

/**
 * Flex container. Can contain <Box />'es or other <Flex />'es
 */
export function Flex({
  // Non flex props
  size = [1, 1, 1],
  direction = 'ltr',
  mainAxis = 'x',
  crossAxis = 'y',
  children,
  position = [0, 0, 0],

  // flex props
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
  m,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  mb,
  ml,
  mr,
  mt,

  padding,
  p,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  pb,
  pl,
  pr,
  pt,

  height,
  width,

  maxHeight,
  maxWidth,
  minHeight,
  minWidth,

  // other
  ...props
}: FlexProps) {
  // must memoize or the object literal will cause every dependent of flexProps to rerender everytime
  const flexProps: R3FlexProps = useMemo(() => {
    const _flexProps = {
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
      m,
      marginBottom,
      marginLeft,
      marginRight,
      marginTop,
      mb,
      ml,
      mr,
      mt,

      padding,
      p,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      pb,
      pl,
      pr,
      pt,

      height,
      width,

      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
    }

    rmUndefFromObj(_flexProps)
    return _flexProps
  }, [
    align,
    alignContent,
    alignItems,
    alignSelf,
    dir,
    flexBasis,
    flexDir,
    flexDirection,
    flexGrow,
    flexShrink,
    flexWrap,
    height,
    justify,
    justifyContent,
    m,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    maxHeight,
    maxWidth,
    mb,
    minHeight,
    minWidth,
    ml,
    mr,
    mt,
    p,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    pb,
    pl,
    pr,
    pt,
    width,
    wrap,
  ])

  const [rootNode] = useState(() => Yoga.Node.create())
  useLayoutEffect(() => {
    setYogaProperties(rootNode, flexProps)
  }, [rootNode, flexProps])

  const state = useMemo(() => {
    const sizeVec3 = new Vector3(...size)
    const depthAxis = ['x', 'y', 'z'].find((axis) => ![mainAxis, crossAxis].includes(axis as Axis))
    const flexWidth = sizeVec3[mainAxis]
    const flexHeight = sizeVec3[crossAxis]
    const rootStart = new Vector3(...position).addScaledVector(new Vector3(size[0], size[1], size[2]), 0.5)
    return { rootNode, depthAxis, mainAxis, crossAxis, sizeVec3, flexWidth, flexHeight, rootStart }
  }, [rootNode, mainAxis, crossAxis, position, size])

  // Layout effect because it must compute *before* its children render
  useLayoutEffect(() => {
    const yogaDirection = direction === 'ltr' ? Yoga.DIRECTION_LTR : direction === 'rtl' ? Yoga.DIRECTION_RTL : direction
    rootNode.calculateLayout(state.flexWidth, state.flexHeight, yogaDirection)
  }, [rootNode, children, state, direction])

  return (
    <group position={position} {...props}>
      <boxContext.Provider value={null}>
        <flexContext.Provider value={state}>{children}</flexContext.Provider>
      </boxContext.Provider>
    </group>
  )
}
