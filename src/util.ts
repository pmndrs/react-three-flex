import { Vector3 } from 'three'
import { YogaNode } from 'yoga-layout'

export const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

export const setYogaProperties = (node: YogaNode, props) => Object.keys(props).forEach((name) => node[`set${capitalize(name)}`](props[name]))

export const vectorFromObject = ({ x, y, z }: { x: number; y: number; z: number }) => new Vector3(x, y, z)

export type Axis = 'x' | 'y' | 'z'
