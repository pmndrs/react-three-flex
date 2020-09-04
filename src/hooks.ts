import { useContext as useContextImpl } from 'react'
import { flexContext } from './context'

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
