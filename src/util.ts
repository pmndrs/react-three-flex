import { Vector3 } from 'three'
import { YogaNode } from 'yoga-layout'
import { YogaFlexProps } from './props'

export const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

export const setYogaProperties = (node: YogaNode, props: YogaFlexProps) => {
  return Object.keys(props).forEach((name) => {
    switch (name) {
      case 'align':
        return node.setAlignItems(props[name])
      case 'justify':
        return node.setJustifyContent(props[name])
      case 'flexDir':
        return node.setFlexDirection(props[name])
      default:
        return node[`set${capitalize(name)}`](props[name])
    }
  })
}

export const vectorFromObject = ({ x, y, z }: { x: number; y: number; z: number }) => new Vector3(x, y, z)

export type Axis = 'x' | 'y' | 'z'
