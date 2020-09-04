import { createContext, Context, useContext } from 'react'
import { YogaNode } from 'yoga-layout-prebuilt'
import { Vector3, Group } from 'three'
import { Axis } from './util'
import { FlexYogaDirection, R3FlexProps } from './props'

export const flexContext = createContext<{
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
} | null>(null)

export const boxContext = createContext<YogaNode | null>(null)

export function useContextSafe<T>(context: Context<Exclude<T, null> | null>) {
  const value = useContext(context)
  if (!value) {
    throw new Error('You must place this hook/component under a <Flex/> component!')
  }
  return value
}
