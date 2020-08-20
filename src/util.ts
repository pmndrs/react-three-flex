import { Vector3 } from 'three'
import Yoga, { YogaNode } from 'yoga-layout-prebuilt'
import { R3FlexProps } from './props'

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

export const jsxPropToYogaProp = (s: string) => s.toUpperCase().replace('-', '_')

export const setYogaProperties = (node: YogaNode, props: R3FlexProps) => {
  return Object.keys(props).forEach((name) => {
    const prop = props[name]

    if (typeof prop === 'string') {
      switch (name) {
        case 'flexDir':
        case 'dir':
        case 'flexDirection':
          return node.setFlexDirection(Yoga[`FLEX_DIRECTION_${jsxPropToYogaProp(prop)}`])
        case 'align':
        case 'alignItems':
          return node.setAlignItems(Yoga[`ALIGN_${jsxPropToYogaProp(prop)}`])
        case 'justify':
        case 'justifyContent':
          return node.setAlignItems(Yoga[`JUSTIFY_${jsxPropToYogaProp(prop)}`])
        case 'wrap':
        case 'flexWrap':
          return node.setFlexWrap(Yoga[`WRAP_${jsxPropToYogaProp(prop)}`])
      }
    } else {
      switch (name) {
        case 'align':
          return node.setAlignItems(prop)
        case 'justify':
          return node.setJustifyContent(prop)
        case 'flexDir':
        case 'dir':
          return node.setFlexDirection(prop)
        case 'wrap':
          return node.setFlexWrap(prop)
        default:
          return node[`set${capitalize(name)}`](prop)
      }
    }
  })
}

export const vectorFromObject = ({ x, y, z }: { x: number; y: number; z: number }) => new Vector3(x, y, z)

export type Axis = 'x' | 'y' | 'z'

export const rmUndefFromObj = (obj: Record<string, any>) => Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}))
