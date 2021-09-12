import { useCallback, useContext as useContextImpl, useMemo } from 'react'
import { Mesh, Vector3 } from 'three'
import { flexContext, boxNodeContext } from './context'

export function useContext<T extends { notInitialized?: boolean }>(context: React.Context<T>) {
  let result = useContextImpl(context)
  if (result == null) {
    console.warn('You must place this hook/component under a <Flex/> component!')
  }
  return result
}

export function useFlexNode() {
  return useContext(boxNodeContext)
}

/**
 * explicitly set the size of the box's yoga node
 * @requires that the surrounding Flex-Element has `disableSizeRecalc` set to `true`
 */
export function useSetSize(): (width: number, height: number) => void {
  //TODO
  const { requestReflow, scaleFactor } = useContext(flexContext)
  const node = useFlexNode()

  const sync = useCallback(
    (width: number, height: number) => {
      if (node == null) {
        throw new Error('yoga node is null. sync size is impossible')
      }
      node.setWidth(width * scaleFactor)
      node.setHeight(height * scaleFactor)
      requestReflow()
    },
    [node, requestReflow]
  )

  return sync
}
