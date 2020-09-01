import React, { Children, createElement, forwardRef, useMemo, useRef, useLayoutEffect, useState } from 'react'
import { Text as TextMeshImpl } from 'troika-three-text'
import { extend, ReactThreeFiber, useThree } from 'react-three-fiber'
import mergeRefs from 'react-merge-refs'
import { useReflow } from '../../src'

extend({ TextMeshImpl })

type TextMesh = ReactThreeFiber.Object3DNode<TextMeshImpl, typeof TextMeshImpl>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textMeshImpl: TextMesh
    }
  }
}

type Props = JSX.IntrinsicElements['mesh'] & {
  children: React.ReactNode
  color?: ReactThreeFiber.Color
  fontSize?: number
  maxWidth?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'right' | 'center' | 'justify'
  font?: string
  anchorX?: number | 'left' | 'center' | 'right'
  anchorY?: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'
  clipRect?: [number, number, number, number]
  depthOffset?: number
  overflowWrap?: 'normal' | 'break-word'
  whiteSpace?: 'normal' | 'overflowWrap' | 'overflowWrap'
}

// const defaultFont = `https://fonts.gstatic.com/s/playfairdisplay/v21/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qC0s.woff`
// const defaultFont = `https://fonts.gstatic.com/s/inter/v2/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hjp-Ek-_EeA.woff`
const defaultFont = `https://fonts.gstatic.com/s/raleway/v17/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvao7CIPrcVIT9d0c8.woff`

export const Text = forwardRef(
  ({ anchorX = 'left', anchorY = 'top', textAlign = 'left', children, maxWidth, ...props }: Props, ref) => {
    const { invalidate } = useThree()
    const reflow = useReflow()
    const textRef = useRef<TextMeshImpl>()
    const [baseMtl, setBaseMtl] = useState()
    const [nodes, text] = useMemo(() => {
      let n: React.ReactNode[] = []
      let t = ''
      Children.forEach(children, (child) => {
        if (typeof child === 'string') {
          t += child
        } else if (child && typeof child === 'object' && (child as React.ReactElement).props.attach === 'material') {
          // Instantiate the base material and grab a reference to it, but don't assign any
          // props, and assign it as the `material`, which Troika will replace behind the scenes.
          n.push(
            createElement((child as React.ReactElement).type, {
              ref: setBaseMtl,
              attach: 'material',
            })
          )
          // Once the base material has been assigned, grab the resulting upgraded material,
          // and apply the original material props to that.
          if (baseMtl) {
            n.push(
              <primitive object={textRef.current.material} {...(child as React.ReactElement).props} attach={null} />
            )
          }
        } else {
          n.push(child)
        }
      })
      return [n, t]
    }, [children, baseMtl])

    useLayoutEffect(() => {
      textRef.current.sync(() => {
        reflow()
        invalidate()
      })
    })

    return (
      <textMeshImpl
        ref={mergeRefs([textRef, ref])}
        text={text}
        anchorX={anchorX}
        anchorY={anchorY}
        textAlign={textAlign}
        maxWidth={maxWidth}
        font={defaultFont}
        {...props}
      >
        {nodes}
      </textMeshImpl>
    )
  }
)
