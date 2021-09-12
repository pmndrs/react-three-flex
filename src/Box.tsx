import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { Axis, getOBBSize } from './util'
import { boxNodeContext, flexContext } from './context'
import { R3FlexProps, useProps, Value } from './props'
import { GroupProps } from '@react-three/fiber'
import { useEffect } from 'react'
import { Box3, Group, Vector3 } from 'three'
import { useContext } from 'react'
import { createContext } from 'react'
import { FlexProps, useBox } from '.'
import { FrameValue } from '@react-spring/core'

const boundingBox = new Box3()
const vec = new Vector3()

/**
 * Box container for 3D Objects.
 * For containing Boxes use `<Flex />`.
 */
export const Box = forwardRef<Group, {
  automaticSize?: boolean,
  onUpdateTransformation?: (x: number, y: number, width: number, height: number) => void
  centerAnchor?: boolean
  children: ((width: number, height: number) => React.ReactNode) | React.ReactNode
  index?: number
} & R3FlexProps>(({
  // Non-flex props
  children,
  centerAnchor,

  onUpdateTransformation,
  index,
  automaticSize,

  // other
  ...props
}, ref) => {
  // must memoize or the object literal will cause every dependent of flexProps to rerender everytime
  const flexProps = useProps(props)

  const [overwrittenProps, setRef] = useBoundingBoxSize(automaticSize, flexProps, children)
  const [[x, y, width, height], setTransformation] = useState<[number, number, number, number]>([0, 0, 0, 0])

  const node = useBox(
    overwrittenProps,
    centerAnchor,
    index,
    useCallback((x: number, y: number, width: number, height: number) => {
      onUpdateTransformation && onUpdateTransformation(x, y, width, height)
      setTransformation([x, y, width, height])
    }, [onUpdateTransformation])
  )

  const size = useMemoArray<[number, number]>([width, height])

  return (
    <group ref={mergeRefs([setRef,])} position-x={x} position-y={y}>
      <boxNodeContext.Provider value={node}>
        <boxSizeContext.Provider value={size}>
          {useMemo(() => (typeof children === 'function' ? children(width, height) : children), [width, height, children])}
        </boxSizeContext.Provider>
      </boxNodeContext.Provider>
    </group>
  )
})

export function useMemoArray<T extends Array<any>>(array: T): T {
  return useMemo(() => array, [array])
}

export function useBoundingBoxSize(enable: boolean | undefined, flexProps: FlexProps, children: any): [overwrittenProps: R3FlexProps, setRef: (ref: Group) => void] {
  const [ref, setRef] = useState<Group | undefined>(undefined)
  const { plane, scaleFactor } = useContext(flexContext)
  const referenceGroup = useContext(boxReferenceContext)
  const overwrittenProps = useMemo(() => {
    if (enable && flexProps.width == null && flexProps.height == null && ref != null) {
      getOBBSize(ref, referenceGroup?.current, boundingBox, vec)
      const mainAxis = plane[0] as Axis
      const crossAxis = plane[1] as Axis
      return {
        width: vec[mainAxis],
        height: vec[crossAxis],
        ...flexProps
      }
    } else {
      return flexProps
    }
  }, [enable, referenceGroup, ref, flexProps, flexProps, children])
  return [overwrittenProps, setRef]
}

const boxReferenceContext = createContext<React.MutableRefObject<Group | undefined>>(null as any)

export const BoxReferenceGroup = forwardRef<Group, GroupProps>(({ children, ...props }, ref) => {
  const group = useRef<Group>()
  return (
    <group ref={mergeRefs([group, ref])} {...props}>
      <boxReferenceContext.Provider value={group}>{children}</boxReferenceContext.Provider>
    </group>
  )
})

export const boxSizeContext = createContext<[number | FrameValue<number>, number | FrameValue<number>]>(null as any)

export function useFlexSize() {
  return useContext(boxSizeContext)
}

Box.displayName = 'Box'
