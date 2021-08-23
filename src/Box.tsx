import React, { useLayoutEffect, useMemo } from 'react'
import Yoga from 'yoga-layout-prebuilt'

import { setYogaProperties, rmUndefFromObj } from './util'
import { boxNodeContext, boxIndexContext, flexContext } from './context'
import { R3FlexProps } from './props'
import { useContext, useFlexNode, useBoxIndex } from './hooks'

/**
 * Box container for 3D Objects.
 * For containing Boxes use `<Flex />`.
 */
export function Box({
  // Non-flex props
  children,
  centerAnchor,

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
  basis,
  flexGrow,
  grow,

  flexShrink,
  shrink,

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

  onUpdateTransformation,

  measureFunc,
  aspectRatio,

  // other
  ...props
}: {
  onUpdateTransformation: (x: number, y: number, width: number, height: number) => void
  centerAnchor?: boolean
  children: React.ReactNode
} & R3FlexProps) {
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
      basis,
      flexGrow,
      grow,
      flexShrink,
      shrink,

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

      measureFunc,
      aspectRatio,
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
    basis,
    flexDir,
    flexDirection,
    flexGrow,
    grow,
    flexShrink,
    shrink,
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
    measureFunc,
    aspectRatio,
  ])

  const { registerBox, unregisterBox, updateBox, scaleFactor } = useContext(flexContext)
  const parent = useFlexNode()
  const index = useBoxIndex()
  const node = useMemo(() => Yoga.Node.create(), [index])

  useLayoutEffect(() => {
    setYogaProperties(node, flexProps, scaleFactor)
  }, [flexProps, node, scaleFactor])

  //register and unregister box
  useLayoutEffect(() => {
    if (!parent) return
    registerBox(node, parent, index)
    return () => unregisterBox(node)
  }, [node, index, parent, registerBox, unregisterBox])

  //update box properties
  useLayoutEffect(() => {
    updateBox(node, flexProps, onUpdateTransformation, centerAnchor)
  }, [node, flexProps, centerAnchor, onUpdateTransformation, updateBox])

  return <boxNodeContext.Provider value={node}>{children}</boxNodeContext.Provider>
}
