import { createContext } from 'react'
import { YGNodeRef } from 'yoga-wasm-slim'
import { Group } from 'three'
import { R3FlexProps } from './props'

export interface SharedFlexContext {
  scaleFactor: number
  requestReflow(): void
  registerBox(node: YGNodeRef, group: Group, flexProps: R3FlexProps, centerAnchor?: boolean): void
  unregisterBox(node: YGNodeRef): void
}

const initialSharedFlexContext: SharedFlexContext = {
  scaleFactor: 100,
  requestReflow() {
    console.warn('Flex not initialized! Please report')
  },
  registerBox() {
    console.warn('Flex not initialized! Please report')
  },
  unregisterBox() {
    console.warn('Flex not initialized! Please report')
  },
}

export const flexContext = createContext<SharedFlexContext>(initialSharedFlexContext)

export interface SharedBoxContext {
  node: YGNodeRef | null
  size: [number, number]
}

const initialSharedBoxContext: SharedBoxContext = {
  node: null,
  size: [0, 0],
}

export const boxContext = createContext<SharedBoxContext>(initialSharedBoxContext)
