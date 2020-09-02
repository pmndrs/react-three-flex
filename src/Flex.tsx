import React, { useLayoutEffect, useMemo, useState, useCallback, useContext, PropsWithChildren, useRef } from 'react'
import Yoga, { YogaNode } from 'yoga-layout-prebuilt'
import { Vector3, Group, Box3 } from 'three'
import { useFrame, useThree } from 'react-three-fiber'

import { setYogaProperties, rmUndefFromObj, vectorFromObject, Axis } from './util'
import { boxContext, flexContext } from './context'
import type { R3FlexProps } from './props'

export function useReflow() {
  const { requestReflow } = useContext(flexContext)
  return requestReflow
}

export type FlexYogaDirection = Yoga.YogaDirection | 'ltr' | 'rtl'
export type FlexPlane = 'xy' | 'yz' | 'xz'

type FlexProps = PropsWithChildren<
  Partial<{
    /**
     * Root container position
     */
    position: [number, number, number]
    size: [number, number, number]
    yogaDirection: FlexYogaDirection
    plane: FlexPlane
    scaleFactor?: number
  }> &
    R3FlexProps
>

/**
 * Flex container. Can contain Boxes or other Flexes
 */
export function Flex({
  // Non flex props
  size = [1, 1, 1],
  yogaDirection = 'ltr',
  plane = 'xy',
  children,
  position = [0, 0, 0],
  scaleFactor = 100,

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
    setYogaProperties(rootNode, flexProps, scaleFactor)
  }, [rootNode, flexProps])

  const { invalidate } = useThree()

  const dirtyRef = useRef(true)
  const requestReflow = useCallback(() => {
    dirtyRef.current = true
    invalidate()
  }, [invalidate])

  // Keeps track of the yoga nodes of the children and the related wrapper groups
  const boxesRef = useRef<{ group: Group; node: YogaNode; flexProps: R3FlexProps; centerAnchor: boolean }[]>([])
  const registerBox = useCallback((group: Group, node: YogaNode, flexProps: R3FlexProps, centerAnchor?: boolean) => {
    const i = boxesRef.current.findIndex((b) => b.group === group && b.node === node)
    if (i !== -1) {
      boxesRef.current.splice(i, 1)
    }

    boxesRef.current.push({ group, node, flexProps, centerAnchor })
  }, [])
  const unregisterBox = useCallback((group: Group, node: YogaNode) => {
    const i = boxesRef.current.findIndex((b) => b.group === group && b.node === node)
    if (i !== -1) {
      boxesRef.current.splice(i, 1)
    }
  }, [])

  const state = useMemo(() => {
    const sizeVec3 = new Vector3(...size)
    const mainAxis = plane[0] as Axis
    const crossAxis = plane[1] as Axis
    const depthAxis = ['x', 'y', 'z'].find((axis: Axis) => ![mainAxis, crossAxis].includes(axis))
    const flexWidth = sizeVec3[mainAxis]
    const flexHeight = sizeVec3[crossAxis]
    const rootStart = new Vector3(...position).addScaledVector(new Vector3(size[0], size[1], size[2]), 0.5)
    const yogaDirection_ =
      yogaDirection === 'ltr' ? Yoga.DIRECTION_LTR : yogaDirection === 'rtl' ? Yoga.DIRECTION_RTL : yogaDirection
    return {
      rootNode,
      depthAxis,
      mainAxis,
      crossAxis,
      sizeVec3,
      flexWidth,
      flexHeight,
      rootStart,
      yogaDirection: yogaDirection_,
      requestReflow,
      registerBox,
      unregisterBox,
      scaleFactor,
    }
  }, [rootNode, plane, position, size, requestReflow, registerBox, unregisterBox, scaleFactor])

  // We need to reflow everything if flex props changes
  useLayoutEffect(() => {
    requestReflow()
  }, [state, children, flexProps, requestReflow])

  // Handles the reflow procedure
  const boundingBox = useMemo(() => new Box3(), [])
  const vec = useMemo(() => new Vector3(), [])
  const reflow = useCallback(() => {
    // Recalc all the sizes
    boxesRef.current.forEach(({ group, node, flexProps }) => {
      boundingBox.setFromObject(group).getSize(vec)
      node.setWidth(flexProps.width || vec[state.mainAxis] * scaleFactor)
      node.setHeight(flexProps.height || vec[state.crossAxis] * scaleFactor)
    })

    // Perform yoga layout calculation
    rootNode.calculateLayout(state.flexWidth * scaleFactor, state.flexHeight * scaleFactor, state.yogaDirection)

    // Reposition after recalculation
    boxesRef.current.forEach(({ group, node, centerAnchor }) => {
      const { left, top, width, height } = node.getComputedLayout()
      const position = vectorFromObject({
        [state.mainAxis]: -state.rootStart[state.mainAxis] + (left + (centerAnchor ? width / 2 : 0)) / scaleFactor,
        [state.crossAxis]: state.rootStart[state.crossAxis] - (top + (centerAnchor ? height / 2 : 0)) / scaleFactor,
        [state.depthAxis]: state.rootStart[state.depthAxis] - state.sizeVec3[state.depthAxis] / 2,
      } as any)
      group.position.copy(position)
    })

    // Ask react-three-fiber to perform a render (invalidateFrameLoop)
    invalidate()
  }, [boundingBox, vec, state, invalidate])

  // We check if we have to reflow every frame
  // This way we can batch the reflow if we have multiple reflow requests
  useFrame(() => {
    if (dirtyRef.current) {
      dirtyRef.current = false
      reflow()
    }
  })

  return (
    <group position={position} {...props}>
      <boxContext.Provider value={null}>
        <flexContext.Provider value={state}>{children}</flexContext.Provider>
      </boxContext.Provider>
    </group>
  )
}
