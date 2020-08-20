import React, { useLayoutEffect, useContext, useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import Yoga from 'yoga-layout-prebuilt'
import { useThree, ReactThreeFiber } from 'react-three-fiber'
import { setYogaProperties, vectorFromObject, rmUndefFromObj } from './util'
import { boxContext, flexContext } from './context'
import { R3FlexProps } from './props'

/**
 * Box container for 3D Objects.
 * For containing Boxes use `<Flex />`.
 */
export function Box({
  // Non-flex props
  children,

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
}: {
  children: any
} & R3FlexProps &
  ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>) {
  const flexProps: R3FlexProps = {
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

  const { rootNode, rootStart, depthAxis, mainAxis, crossAxis, sizeVec3 } = useContext(flexContext)
  const parent = useContext(boxContext) || rootNode
  const group = useRef<THREE.Group>()
  const [vec] = useState(() => new THREE.Vector3())
  const [boundingBox] = useState(() => new THREE.Box3())
  const [node] = useState(() => Yoga.Node.create())
  const { invalidate } = useThree()
  useMemo(() => setYogaProperties(node, flexProps), [flexProps, node])

  // Make child known to the parents yoga instance *before* it calculates layout
  useLayoutEffect(() => {
    parent.insertChild(node, parent.getChildCount())
    // Remove child on unmount
    return () => parent.removeChild(node)
  }, [])

  // Measure view *before* the parent has calculated layout
  useLayoutEffect(() => {
    boundingBox.setFromObject(group.current).getSize(vec)
    node.setWidth(vec[mainAxis])
    node.setHeight(vec[crossAxis])
  }, [node, mainAxis, crossAxis, boundingBox, vec])

  // Position view according to yoga *after* the parent has calculated layout
  useEffect(() => {
    const { left, top, width, height } = node.getComputedLayout()
    const position = vectorFromObject({
      x: rootStart[mainAxis] - (left + width / 2),
      y: rootStart[crossAxis] - (+top + height / 2),
      z: rootStart[depthAxis] - sizeVec3[depthAxis] / 2,
    })
    group.current.position.copy(position)
    invalidate()
  })

  return (
    <group ref={group} {...props}>
      <boxContext.Provider value={node}>{children}</boxContext.Provider>
    </group>
  )
}
