import React, { ComponentProps } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { Box } from './Box'
import { SpringConfig, SpringValue, useSpring } from 'react-spring'

export function SpringBox({
  children,
  config,
  ...props
}: Omit<ComponentProps<typeof Box>, 'onUpdateTransformation' | 'children'> & {
  config?: SpringConfig
  children:
    | ((
        x: SpringValue<number>,
        y: SpringValue<number>,
        width: SpringValue<number>,
        height: SpringValue<number>
      ) => React.ReactNode)
    | React.ReactNode
}) {
  const [{ x, y, width, height }, api] = useSpring(
    {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      config,
    },
    [config]
  )

  const onUpdateTransformation = useCallback(
    (x: number, y: number, width: number, height: number) =>
      api.start({
        x,
        y,
        width,
        height,
      }),
    [api]
  )
  const child = useMemo(
    () => (typeof children === 'function' ? children(x, y, width, height) : children),
    [x, y, width, height, children]
  )
  return (
    <Box onUpdateTransformation={onUpdateTransformation} {...props}>
      {child}
    </Box>
  )
}
