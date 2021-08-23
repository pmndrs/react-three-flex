import { createContext } from 'react'
import { YogaNode } from 'yoga-layout-prebuilt'
import { R3FlexProps } from './props'

export interface SharedFlexContext {
  scaleFactor: number
  requestReflow(): void
  registerBox(node: YogaNode, parent: YogaNode, index: number): void
  updateBox(
    node: YogaNode,
    flexProps: R3FlexProps,
    onUpdateTransformation: (x: number, y: number, width: number, height: number) => void,
    centerAnchor?: boolean
  ): void
  unregisterBox(node: YogaNode): void
}

const initialSharedFlexContext: SharedFlexContext = {
  scaleFactor: 100,
  requestReflow() {
    console.warn('Flex not initialized! Please report')
  },
  registerBox() {
    console.warn('Flex not initialized! Please report')
    return 0
  },
  updateBox() {
    console.warn('Flex not initialized! Please report')
  },
  unregisterBox() {
    console.warn('Flex not initialized! Please report')
  },
}

export const flexContext = createContext<SharedFlexContext>(initialSharedFlexContext)

export const boxNodeContext = createContext<YogaNode | null>(null)

export const boxIndexContext = createContext<number>(-1)
