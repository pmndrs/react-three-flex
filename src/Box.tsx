import React, { useLayoutEffect, useMemo } from 'react'
import Yoga from 'yoga-layout-prebuilt'

import { setYogaProperties, rmUndefFromObj } from './util'
import { boxContext, flexContext } from './context'
import { R3FlexProps } from './props'
import { useReflow, useContext } from './hooks'

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
  ])

  const { registerBox, unregisterBox, scaleFactor } = useContext(flexContext)
  const { node: parent } = useContext(boxContext)
  const node = useMemo(() => Yoga.Node.create(), [])
  const reflow = useReflow()

  useLayoutEffect(() => {
    setYogaProperties(node, flexProps, scaleFactor)
  }, [flexProps, node, scaleFactor])

  useLayoutEffect(() => {
    if (!parent) return

    // Remove child on unmount
    return () => {
      parent.removeChild(node)
      unregisterBox(node)
    }
  }, [node, parent])

  // Make child known to the parents yoga instance *before* it calculates layout
  useLayoutEffect(() => {
    if (!parent) return

    if (registerBox(node, flexProps, onUpdateTransformation, centerAnchor)) {
      //newly registered node: add it to the parent
      parent.insertChild(node, parent.getChildCount())
    }
  }, [node, parent, flexProps, centerAnchor, onUpdateTransformation, registerBox, unregisterBox])

  // We need to reflow if props change
  useLayoutEffect(() => {
    reflow()
  }, [children, flexProps, reflow])

  const sharedBoxContext = useMemo(() => ({ node }), [node])

  return <boxContext.Provider value={sharedBoxContext}>{children}</boxContext.Provider>
}
