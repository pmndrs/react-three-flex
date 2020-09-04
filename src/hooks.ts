import { flexContext, useContextSafe } from './context'

export function useReflow() {
  const { requestReflow } = useContextSafe(flexContext)
  return requestReflow
}
