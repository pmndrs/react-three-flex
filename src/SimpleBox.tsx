import React, { ComponentProps, useState } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { Box } from './Box'

export function SimpleBox({
  children,
  ...props
}: Omit<ComponentProps<typeof Box>, 'onUpdateTransformation' | 'children'> & {
  children: ((x: number, y: number, width: number, height: number) => React.ReactNode) | React.ReactNode
}) {
  const [transformation, setTransformation] = useState([0, 0, 0, 0] as [number, number, number, number])
  const onUpdateTransformation = useCallback(
    (...params: [x: number, y: number, width: number, height: number]) => setTransformation(params),
    [setTransformation]
  )
  const child = useMemo(
    () => (typeof children === 'function' ? children(...transformation) : children),
    [children, transformation]
  )
  return (
    <Box onUpdateTransformation={onUpdateTransformation} {...props}>
      {child}
    </Box>
  )
}
