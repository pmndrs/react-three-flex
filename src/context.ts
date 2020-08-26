import { createContext } from 'react'
import { YogaNode } from 'yoga-layout-prebuilt'
import { Axis } from './util'
import { Vector3 } from 'three'

export const flexContext = createContext<{
  rootNode: YogaNode
  depthAxis: string
  mainAxis: Axis
  crossAxis: Axis
  sizeVec3: Vector3
  flexWidth: number
  flexHeight: number
  rootStart: Vector3
  updateId: number
  flexInvalidate(): void
}>(null)

export const boxContext = createContext<YogaNode>(null)
