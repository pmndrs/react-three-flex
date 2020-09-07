import React, { useRef, useLayoutEffect } from 'react'
import { useReflow } from 'react-three-flex'
import { Text as TextImpl } from 'drei/abstractions/Text'

function Text({
  font = `https://cdn.jsdelivr.net/npm/inter-ui/Inter%20(web)/Inter-Bold.woff`,
  anchorX = 'left',
  anchorY = 'top',
  textAlign = 'left',
  ...props
}) {
  const reflow = useReflow()
  const textRef = useRef()
  useLayoutEffect(() => void textRef.current.sync(reflow))
  return <TextImpl ref={textRef} anchorX={anchorX} anchorY={anchorY} textAlign={textAlign} font={font} {...props} />
}

export default Text
