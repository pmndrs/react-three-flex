import { useContext } from 'react'
import { flexContext } from './context'

export function useReflow() {
  const { requestReflow } = useContext(flexContext)
  return requestReflow
}
