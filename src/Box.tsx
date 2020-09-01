import React, { useLayoutEffect, useContext, useRef, useState, useMemo, PropsWithChildren } from 'react'
import * as THREE from 'three'
import Yoga from 'yoga-layout-prebuilt'
import { ReactThreeFiber } from 'react-three-fiber'
import { useHelper } from 'drei'
import { BoxHelper } from 'three'

import { setYogaProperties, rmUndefFromObj } from './util'
import { boxContext, flexContext } from './context'
import { R3FlexProps } from './props'
import { useReflow } from './Flex'

/**
 * Box container for 3D Objects.
 * For containing Boxes use `<Flex />`.
 */
export function Box({
  // Non-flex props
  children,

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
}: PropsWithChildren<R3FlexProps & ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>>) {
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
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
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
    width,
    wrap,
  ])

  const { rootNode, registerBox, unregisterBox, scaleFactor } = useContext(flexContext)
  const parent = useContext(boxContext)
  const group = useRef<THREE.Group>()
  const [node] = useState(() => Yoga.Node.create())
  const reflow = useReflow()

  useLayoutEffect(() => {
    setYogaProperties(node, flexProps, scaleFactor)
  }, [flexProps, node])

  // Make child known to the parents yoga instance *before* it calculates layout
  useLayoutEffect(() => {
    parent.insertChild(node, parent.getChildCount())
    registerBox(group.current, node, flexProps)

    // Remove child on unmount
    return () => {
      parent.removeChild(node)
      unregisterBox(group.current, node)
    }
  }, [node, parent])

  // We need to reflow if props change
  useLayoutEffect(() => {
    reflow()
  }, [children, flexProps])

  // useHelper(group, BoxHelper, 'red')

  return (
    <group ref={group} name="r3flex-box" {...props}>
      <boxContext.Provider value={node}>{children}</boxContext.Provider>
    </group>
  )
}
