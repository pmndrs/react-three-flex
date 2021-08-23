import React, { useLayoutEffect, useMemo, useCallback, PropsWithChildren, useRef } from 'react'
import Yoga, { YogaNode } from 'yoga-layout-prebuilt'

import { setYogaProperties, rmUndefFromObj, Axis, getDepthAxis, getFlex2DSize, getAxis } from './util'
import { boxIndexContext, boxNodeContext, flexContext, SharedFlexContext } from './context'
import type { R3FlexProps, FlexYogaDirection, FlexPlane } from './props'

export type FlexProps = PropsWithChildren<
  Partial<{
    /**
     * Root container position
     */
    size: [number, number, number]
    yogaDirection: FlexYogaDirection
    plane: FlexPlane
    scaleFactor?: number
    maxUps?: number
    onReflow?: (totalWidth: number, totalHeight: number) => void
  }> &
    R3FlexProps
>
interface BoxesItem {
  node: YogaNode
  parent: YogaNode
  yogaIndex: number
  reactIndex: number
  flexProps?: R3FlexProps
  centerAnchor?: boolean
  onUpdateTransformation?: (x: number, y: number, width: number, height: number) => void
}

/**
 * Flex container. Can contain Boxes
 */
export function Flex({
  // Non flex props
  size = [1, 1, 1],
  yogaDirection = 'ltr',
  plane = 'xy',
  children,
  scaleFactor = 100,
  onReflow,
  maxUps,

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

  measureFunc,
  aspectRatio,

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

  // Keeps track of the yoga nodes of the children and the related wrapper groups
  const boxesRef = useRef<BoxesItem[]>([])
  const registerBox = useCallback((node: YogaNode, parent: YogaNode, index: number) => {
    boxesRef.current.push({ node, reactIndex: index, yogaIndex: -1, parent })
    //TODO: defer just like the reflow
    updateRealBoxIndices(boxesRef.current, parent)
    requestReflow()
  }, [])
  const updateBox = useCallback(
    (
      node: YogaNode,
      flexProps: R3FlexProps,
      onUpdateTransformation: (x: number, y: number, width: number, height: number) => void,
      centerAnchor?: boolean
    ) => {
      const i = boxesRef.current.findIndex((b) => b.node === node)
      if (i !== -1) {
        boxesRef.current[i] = { ...boxesRef.current[i], flexProps, onUpdateTransformation, centerAnchor }
        requestReflow()
      } else {
        console.warn(`unable to unregister box (node could not be found)`)
      }
    },
    []
  )
  const unregisterBox = useCallback((node: YogaNode) => {
    const i = boxesRef.current.findIndex((b) => b.node === node)
    if (i !== -1) {
      const { parent, node } = boxesRef.current[i]
      boxesRef.current.splice(i, 1)
      parent.removeChild(node)
      //TODO: defer just like the reflow
      updateRealBoxIndices(boxesRef.current, parent)
      requestReflow()
    } else {
      console.warn(`unable to unregister box (node could not be found)`)
    }
  }, [])

  // Reference to the yoga native node
  const node = useMemo(() => Yoga.Node.create(), [])
  useLayoutEffect(() => {
    setYogaProperties(node, flexProps, scaleFactor)
  }, [node, flexProps, scaleFactor])

  // Mechanism for invalidating and recalculating layout
  const reflowTimeout = useRef<number | undefined>(undefined)

  const requestReflow = useCallback(() => {
    if (reflowTimeout.current == null) {
      reflowTimeout.current = setTimeout(() => {
        reflowTimeout.current = undefined
        reflow()
      }, 1000 / (maxUps ?? 10))
    }
  }, [maxUps])

  // We need to reflow everything if flex props changes
  useLayoutEffect(() => {
    requestReflow()
  }, [flexProps, requestReflow])

  // Common variables for reflow
  const mainAxis = plane[0] as Axis
  const crossAxis = plane[1] as Axis
  const depthAxis = getDepthAxis(plane)
  const [flexWidth, flexHeight] = getFlex2DSize(size, plane)
  const yogaDirection_ =
    yogaDirection === 'ltr' ? Yoga.DIRECTION_LTR : yogaDirection === 'rtl' ? Yoga.DIRECTION_RTL : yogaDirection

  // Shared context for flex and box
  const sharedFlexContext = useMemo<SharedFlexContext>(
    () => ({
      requestReflow,
      registerBox,
      updateBox,
      unregisterBox,
      scaleFactor,
    }),
    [requestReflow, registerBox, unregisterBox, scaleFactor]
  )

  // Handles the reflow procedure
  function reflow() {
    // Perform yoga layout calculation
    node.calculateLayout(flexWidth * scaleFactor, flexHeight * scaleFactor, yogaDirection_)

    let minX = 0
    let maxX = 0
    let minY = 0
    let maxY = 0

    // Reposition after recalculation
    boxesRef.current.forEach(({ node, centerAnchor, onUpdateTransformation, flexProps }) => {
      const { left, top, width: computedWidth, height: computedHeight } = node.getComputedLayout()

      const width =
        (typeof flexProps?.width === 'number' ? flexProps.width : null) || computedWidth.valueOf() / scaleFactor
      const height =
        (typeof flexProps?.height === 'number' ? flexProps.height : null) || computedHeight.valueOf() / scaleFactor

      const axesValues = [
        (left + (centerAnchor ? width / 2 : 0)) / scaleFactor,
        -(top + (centerAnchor ? height / 2 : 0)) / scaleFactor,
        0,
      ]
      const axes: Array<Axis> = [mainAxis, crossAxis, depthAxis]

      onUpdateTransformation &&
        onUpdateTransformation(getAxis('x', axes, axesValues), getAxis('y', axes, axesValues), width, height)

      minX = Math.min(minX, left)
      minY = Math.min(minY, top)
      maxX = Math.max(maxX, left + width)
      maxY = Math.max(maxY, top + height)
    })

    // Call the reflow event to update resulting size
    onReflow && onReflow((maxX - minX) / scaleFactor, (maxY - minY) / scaleFactor)
  }

  const indexedChildren = useMemo(
    () =>
      React.Children.map(children, (child, index) => (
        <boxIndexContext.Provider value={index}>{child}</boxIndexContext.Provider>
      )),
    [children]
  )

  return (
    <flexContext.Provider value={sharedFlexContext}>
      <boxNodeContext.Provider value={node}>{indexedChildren}</boxNodeContext.Provider>
    </flexContext.Provider>
  )
}

/**
 * aligns react index with an ordered continous yogaIndex
 * @param boxesItems all boxes
 * @param parent the parent in which the reordering should happen
 */
function updateRealBoxIndices(boxesItems: Array<BoxesItem>, parent: YogaNode): void {
  //could be done without the filter more efficiently with another data structure (e.g. map with parent as key)
  boxesItems
    .filter(({ parent: boxParent }) => boxParent === parent)
    .sort(({ reactIndex: r1 }, { reactIndex: r2 }) => r1 - r2)
    .forEach((box, index) => {
      if (box.yogaIndex != index) {
        if (box.yogaIndex != -1) {
          parent.removeChild(box.node)
        }
        parent.insertChild(box.node, index)
        box.yogaIndex = index
      }
    })
}
