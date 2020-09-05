import React, { Children, createElement, forwardRef, useMemo, useRef, useLayoutEffect, useState } from "react"
import { Text as TextMeshImpl } from "troika-three-text"
import { extend, useThree } from "react-three-fiber"
import mergeRefs from "react-merge-refs"
import { useReflow } from "react-three-flex"

extend({ TextMeshImpl })

const Text = forwardRef(
  (
    {
      font = `/AirbnbCerealBold.woff`,
      anchorX = "left",
      anchorY = "top",
      textAlign = "left",
      children,
      maxWidth,
      ...props
    }: Props,
    ref,
  ) => {
    const { invalidate } = useThree()
    const reflow = useReflow()
    const textRef = useRef()
    const [baseMtl, setBaseMtl] = useState()
    const [nodes, text] = useMemo(() => {
      let n = []
      let t = ""
      Children.forEach(children, (child) => {
        if (typeof child === "string") {
          t += child
        } else if (child && typeof child === "object" && child.props.attach === "material") {
          // Instantiate the base material and grab a reference to it, but don't assign any
          // props, and assign it as the `material`, which Troika will replace behind the scenes.
          n.push(
            createElement(child.type, {
              ref: setBaseMtl,
              attach: "material",
            }),
          )
          // Once the base material has been assigned, grab the resulting upgraded material,
          // and apply the original material props to that.
          if (baseMtl) {
            n.push(<primitive object={textRef.current.material} {...child.props} attach={null} />)
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
        font={font}
        {...props}>
        {nodes}
      </textMeshImpl>
    )
  },
)

export default Text
