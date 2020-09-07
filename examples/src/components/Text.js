import React, { useRef, useLayoutEffect, useEffect } from 'react'
import { useReflow } from 'react-three-flex'
import { Text as TextImpl } from 'drei/abstractions/Text'

const jsdeliver = "https://cdn.jsdelivr.net/npm/inter-ui/Inter%20(web)/"

function Text({
  bold = false,
  anchorX = 'left',
  anchorY = 'top',
  textAlign = 'left',
  ...props
}) {
  const reflow = useReflow()
  const font = bold ? jsdeliver + "Inter-Bold.woff" : jsdeliver + "Inter-Regular.woff"
  return <TextImpl anchorX={anchorX} anchorY={anchorY} textAlign={textAlign} font={font} onSync={reflow} {...props} />
}

export default Text
