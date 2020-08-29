import React, { useLayoutEffect, useMemo, useState, useCallback, useContext, PropsWithChildren, useRef } from 'react'
import Yoga, { YogaNode } from 'yoga-layout-prebuilt'
import { Vector3, Group, Box3 } from 'three'
import { setYogaProperties, rmUndefFromObj, vectorFromObject, Axis } from './util'

import { boxContext, flexContext } from './context'

import type { R3FlexProps } from './props'
import { useFrame, useThree } from 'react-three-fiber'

export function useReflow() {
  const { doReflow } = useContext(flexContext)
  return doReflow
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

  const dirtyRef = useRef(true)
  const doReflow = useCallback(() => {
    dirtyRef.current = true
  }, [])

  // Keeps tracks of the yoga nodes of the children and the related wrapper groups
  const boxesRef = useRef<{ group: Group; node: YogaNode }[]>([])
  const registerBox = useCallback((group: Group, node: YogaNode) => {
    const i = boxesRef.current.findIndex((b) => b.group === group && b.node === node)
    if (i !== -1) {
      boxesRef.current.splice(i, 1)
    }

    boxesRef.current.push({ group, node })
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
      doReflow,
      registerBox,
      unregisterBox,
    }
  }, [rootNode, plane, position, size, doReflow, registerBox, unregisterBox])

  // We need to reflow everything if flex props changes
  useLayoutEffect(() => {
    dirtyRef.current = true
  }, [state, children, flexProps])

  // We check if we have to relayout every frame
  // This way we can batch the relayout if we have multiple reflow requests
  const { invalidate } = useThree()
  useFrame(() => {
    if (dirtyRef.current) {
      const boundingBox = new Box3()
      const vec = new Vector3()

      // Recalc all the sizes
      boxesRef.current.forEach(({ group, node }) => {
        boundingBox.setFromObject(group).getSize(vec)
        node.setWidth(vec[state.mainAxis])
        node.setHeight(vec[state.crossAxis])
      })

      // Perform yoga layout calculation
      rootNode.calculateLayout(state.flexWidth, state.flexHeight, state.yogaDirection)

      // Reposition after recalculation
      boxesRef.current.forEach(({ group, node }) => {
        const { left, top, width, height } = node.getComputedLayout()
        const position = vectorFromObject({
          [state.mainAxis]: -state.rootStart[state.mainAxis] + (left + width / 2),
          [state.crossAxis]: state.rootStart[state.crossAxis] - (+top + height / 2),
          [state.depthAxis]: state.rootStart[state.depthAxis] - state.sizeVec3[state.depthAxis] / 2,
        } as any)
        group.position.copy(position)
        invalidate()
      })

      dirtyRef.current = false
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
