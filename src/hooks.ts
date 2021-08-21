import { useCallback, useContext as useContextImpl } from 'react'
import { Mesh, Vector3 } from 'three'
import { flexContext, boxContext } from './context'

export function useContext<T>(context: React.Context<T>) {
  let result = useContextImpl(context)
  if (!result) {
    console.warn('You must place this hook/component under a <Flex/> component!')
  }
  return result
}

export function useReflow() {
  const { requestReflow } = useContext(flexContext)
  return requestReflow
}

export function useFlexNode() {
  const { node } = useContext(boxContext)
  return node
}

/**
 * explicitly set the size of the box's yoga node
 * @requires that the surrounding Flex-Element has `disableSizeRecalc` set to `true`
 */
export function useSetSize(): (width: number, height: number) => void {
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

const helperVector = new Vector3()

/**
 * explicitly sync the yoga node size with a mesh's geometry and uniform global scale
 * @requires that the surrounding Flex-Element has `disableSizeRecalc` set to `true`
 */
export function useSyncGeometrySize(): (mesh: Mesh) => void {
  const setSize = useSetSize()
  return useCallback(
    (mesh: Mesh) => {
      mesh.updateMatrixWorld()
      helperVector.setFromMatrixScale(mesh.matrixWorld)

      //since the scale is in global space but the box boundings are in local space, scaling can't be translated, thus a uniform scaling is required to have this work properly
      if (Math.abs(helperVector.x - helperVector.y) > 0.001 || Math.abs(helperVector.y - helperVector.z) > 0.001) {
        throw new Error('object was not scaled uniformly')
      }
      const worldScale = helperVector.x
      mesh.geometry.computeBoundingBox()
      const box = mesh.geometry.boundingBox!
      setSize((box.max.x - box.min.x) * worldScale, (box.max.y - box.min.y) * worldScale)
    },
    [setSize]
  )
}
