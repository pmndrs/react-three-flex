import { createContext } from 'react'
import { YogaNode } from 'yoga-layout-prebuilt'
import { R3FlexProps } from './props'

export interface SharedFlexContext {
  scaleFactor: number
  requestReflow(): void
  registerBox(node: YogaNode, flexProps: R3FlexProps, onUpdateTransformation: (x: number, y: number, width: number, height: number) => void, centerAnchor?: boolean): boolean
  unregisterBox(node: YogaNode): void
}

const initialSharedFlexContext: SharedFlexContext = {
  scaleFactor: 100,
  requestReflow() {
    console.warn('Flex not initialized! Please report')
  },
  registerBox() {
    console.warn('Flex not initialized! Please report')
    return false
  },
  unregisterBox() {
    console.warn('Flex not initialized! Please report')
  },
}

export const flexContext = createContext<SharedFlexContext>(initialSharedFlexContext)

export interface SharedBoxContext {
  node: YogaNode | null
}

const initialSharedBoxContext: SharedBoxContext = {
  node: null
}

export const boxContext = createContext<SharedBoxContext>(initialSharedBoxContext)
