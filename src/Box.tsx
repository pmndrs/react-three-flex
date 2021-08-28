import React, { useMemo, useRef, useState } from 'react'

import { Axis, getOBBSize, rmUndefFromObj } from './util'
import { boxNodeContext, flexContext } from './context'
import { R3FlexProps, Value } from './props'
import { useBox } from './useBox'
import { useCallback } from 'react'
import { GroupProps } from '@react-three/fiber'
import { useEffect } from 'react'
import { Box3, Group, Vector3 } from 'three'
import { useContext } from 'react'
import { createContext } from 'react'

const boundingBox = new Box3()
const vec = new Vector3()

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

  index,

  // other
  ...props
}: {
  onUpdateTransformation: (x: number, y: number, width: number, height: number) => void
  centerAnchor?: boolean
  children: React.ReactNode
  index?: number
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

  const [[x, y, w, h], setTransformation] = useState([0, 0, 0, 0] as [number, number, number, number])

  const { plane, scaleFactor } = useContext(flexContext)

  const [sizeProps, setOverrideProps] = useState<{ width?: Value; height?: Value }>({})

  const combinedProps = useMemo(() => ({ ...sizeProps, ...flexProps }), [sizeProps, flexProps])

  const referenceGroup = useContext(boxReferenceContext)

  const node = useBox(
    combinedProps,
    centerAnchor,
    index,
    useCallback((...params: [x: number, y: number, w: number, h: number]) => setTransformation(params), [])
  )

  const group = useRef<THREE.Group>()
  useEffect(() => {
    if (width == null && height == null && group.current != null && node.getChildCount() === 0) {
      getOBBSize(group.current, referenceGroup.current, boundingBox, vec)
      const mainAxis = plane[0] as Axis
      const crossAxis = plane[1] as Axis
      setOverrideProps({
        width: vec[mainAxis] * scaleFactor,
        height: vec[crossAxis] * scaleFactor,
      })
    } else {
      setOverrideProps({})
    }
  }, [children, width, height])

  const size = useMemo<[number, number]>(() => [w, h], [w, h])

  return (
    <group position-x={x} position-y={y}>
      <boxNodeContext.Provider value={node}>
        <boxSizeContext.Provider value={size}>
          {useMemo(() => (typeof children === 'function' ? children(w, h) : children), [w, h, children])}
        </boxSizeContext.Provider>
      </boxNodeContext.Provider>
    </group>
  )
}

const boxReferenceContext = createContext<React.MutableRefObject<Group | undefined>>(null as any)

export function BoxReferenceGroup({ children, ...props }: GroupProps) {
  const ref = useRef<Group>()
  return (
    <group ref={ref} {...props}>
      <boxReferenceContext.Provider value={ref}>{children}</boxReferenceContext.Provider>
    </group>
  )
}

export const boxSizeContext = createContext<[number, number]>(null as any)

export function useFlexSize() {
  return useContext(boxSizeContext)
}
