import React, { useLayoutEffect, useContext, useRef, useState, useEffect, useMemo } from 'react'
import { Vector3, Box3, Group } from 'three'
import Yoga from 'yoga-layout'
import { useThree } from 'react-three-fiber'
import { setYogaProperties, vectorFromObject } from './util'
import { boxContext, flexContext } from './context'

export function Box({ children, flexProps = {} }) {
  const { rootNode, rootStart, depthAxis, mainAxis, crossAxis, sizeVec3 } = useContext(flexContext)
  const parent = useContext(boxContext) || rootNode
  const group = useRef<Group>()
  const [vec] = useState(() => new Vector3())
  const [boundingBox] = useState(() => new Box3())
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
    <group ref={group}>
      <boxContext.Provider value={node}>{children}</boxContext.Provider>
    </group>
  )
}
