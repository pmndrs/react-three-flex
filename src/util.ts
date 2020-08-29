import { Vector3 } from 'three'
import Yoga, { YogaNode } from 'yoga-layout-prebuilt'
import { R3FlexProps } from './props'

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

export const jsxPropToYogaProp = (s: string) => s.toUpperCase().replace('-', '_')

export const setYogaProperties = (node: YogaNode, props: R3FlexProps) => {
  return Object.keys(props).forEach((name) => {
    const value = props[name]

    if (typeof value === 'string') {
      switch (name) {
        case 'flexDir':
        case 'dir':
        case 'flexDirection':
          return node.setFlexDirection(Yoga[`FLEX_DIRECTION_${jsxPropToYogaProp(value)}`])
        case 'align':
        case 'alignItems':
          return node.setAlignItems(Yoga[`ALIGN_${jsxPropToYogaProp(value)}`])
        case 'justify':
        case 'justifyContent':
          return node.setJustifyContent(Yoga[`JUSTIFY_${jsxPropToYogaProp(value)}`])
        case 'wrap':
        case 'flexWrap':
          return node.setFlexWrap(Yoga[`WRAP_${jsxPropToYogaProp(value)}`])
      }
    } else {
      switch (name) {
        case 'align':
          return node.setAlignItems(value)
        case 'justify':
          return node.setJustifyContent(value)
        case 'flexDir':
        case 'dir':
          return node.setFlexDirection(value)
        case 'wrap':
          return node.setFlexWrap(value)
        case 'padding':
        case 'p':
          return node.setPadding(Yoga.EDGE_ALL, value)
        case 'paddingLeft':
        case 'pl':
          return node.setPadding(Yoga.EDGE_LEFT, value)
        case 'paddingRight':
        case 'pr':
          return node.setPadding(Yoga.EDGE_RIGHT, value)
        case 'paddingTop':
        case 'pt':
          return node.setPadding(Yoga.EDGE_TOP, value)
        case 'paddingBottom':
        case 'pb':
          return node.setPadding(Yoga.EDGE_BOTTOM, value)

        case 'margin':
        case 'm':
          return node.setMargin(Yoga.EDGE_ALL, value)
        case 'marginLeft':
        case 'ml':
          return node.setMargin(Yoga.EDGE_LEFT, value)
        case 'marginRight':
        case 'mr':
          return node.setMargin(Yoga.EDGE_RIGHT, value)
        case 'marginTop':
        case 'mt':
          return node.setMargin(Yoga.EDGE_TOP, value)
        case 'marginBottom':
        case 'mb':
          return node.setMargin(Yoga.EDGE_BOTTOM, value)

        default:
          return node[`set${capitalize(name)}`](value)
      }
    }
  })
}

export const vectorFromObject = ({ x, y, z }: { x: number; y: number; z: number }) => new Vector3(x, y, z)

export type Axis = 'x' | 'y' | 'z'

export const rmUndefFromObj = (obj: Record<string, any>) =>
  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}))
