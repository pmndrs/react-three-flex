import { Vector3 } from 'three'
import Yoga, { YogaNode } from 'yoga-layout-prebuilt'
import { YogaFlexProps } from './props'

export const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

export const setYogaProperties = (node: YogaNode, props: YogaFlexProps) => {
  return Object.keys(props).forEach((name) => {
    const prop = props[name]

    if (typeof prop === 'string') {
      switch (name) {
        case 'flexDir':
        case 'dir':
        case 'flexDirection':
          return node.setFlexDirection(Yoga[`FLEX_DIRECTION_${prop.toUpperCase()}`])
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
