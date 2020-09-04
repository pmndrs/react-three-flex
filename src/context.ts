import { createContext } from 'react'
import { YogaNode } from 'yoga-layout-prebuilt'
import { Vector3, Group } from 'three'
import { Axis } from './util'
import { FlexYogaDirection, R3FlexProps } from './props'

export interface SharedFlexContext {
  rootNode: YogaNode
  mainAxis: Axis
  crossAxis: Axis
  depthAxis: Axis
  sizeVec3: Vector3
  flexWidth: number
  flexHeight: number
  scaleFactor: number
  rootStart: Vector3
  yogaDirection: FlexYogaDirection
  requestReflow(): void
  registerBox(group: Group, node: YogaNode, flexProps: R3FlexProps, centerAnchor?: boolean): void
  unregisterBox(group: Group, node: YogaNode): void
}

const initialSharedFlexContext: SharedFlexContext = {
  rootNode: null as any,
  mainAxis: 'x',
  crossAxis: 'y',
  depthAxis: 'z',
  sizeVec3: new Vector3(0, 0, 0),
  flexWidth: 0,
  flexHeight: 0,
  scaleFactor: 100,
  rootStart: new Vector3(0, 0, 0),
  yogaDirection: 'ltr',
  requestReflow() {
    console.warn('Flex not initialized! Please report')
  },
  registerBox(group: Group, node: YogaNode, flexProps: R3FlexProps, centerAnchor?: boolean) {
    console.warn('Flex not initialized! Please report')
  },
  unregisterBox(group: Group, node: YogaNode) {
    console.warn('Flex not initialized! Please report')
  },
}

export const flexContext = createContext<SharedFlexContext>(initialSharedFlexContext)

export const boxContext = createContext<YogaNode | null>(null)
