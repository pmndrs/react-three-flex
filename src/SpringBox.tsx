import React, { useMemo } from 'react'
import { boxSizeContext, useSpringBox } from '.'
import { R3FlexProps, useProps } from './props'
import { useMemoArray, useBoundingBoxSize } from './Box'
import { FrameValue, a, AnimatedProps } from '@react-spring/three'
import { boxNodeContext } from './context'
import { GroupProps } from '@react-three/fiber'

export function SpringBox({
  // Non-flex props
  children,
  centerAnchor,

  onUpdateTransformation,
  index,
  automaticSize,

  // other
  ...props
}: {
  automaticSize?: boolean
  onUpdateTransformation?: (x: number, y: number, width: number, height: number) => void
  centerAnchor?: boolean
  children: ((width: FrameValue<number>, height: FrameValue<number>) => React.ReactNode) | React.ReactNode
  index?: number
} & R3FlexProps &
  AnimatedProps<GroupProps>) {
  const [flexProps, groupProps] = useProps<AnimatedProps<GroupProps>>(props)

  const [overwrittenProps, setRef] = useBoundingBoxSize(automaticSize, flexProps, children)

  const { node, x, y, width, height } = useSpringBox(overwrittenProps, centerAnchor, index, onUpdateTransformation)

  const size = useMemoArray<[FrameValue<number>, FrameValue<number>]>([width, height])

  return (
    <a.group ref={setRef} {...groupProps} position-x={x} position-y={y}>
      <boxNodeContext.Provider value={node}>
        <boxSizeContext.Provider value={size}>
          {useMemo(
            () => (typeof children === 'function' ? children(width, height) : children),
            [width, height, children]
          )}
        </boxSizeContext.Provider>
      </boxNodeContext.Provider>
    </a.group>
  )
}
