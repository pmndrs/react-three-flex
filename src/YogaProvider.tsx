import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import { useAsset } from 'use-asset'
// eslint-disable-next-line import/no-unresolved
import Yoga from 'yoga-layout'

interface YogaContextData {
  initYoga: () => Promise<typeof Yoga>
}

const YogaContext = createContext<YogaContextData>({
  initYoga() {
    return Promise.reject(new Error("YogaRuntimeProvider hasn't been initialized"))
  },
})

export const YogaProvider = ({ initYoga, ...props }: PropsWithChildren<YogaContextData>) => {
  const value = useMemo(() => ({ initYoga }), [initYoga])
  return <YogaContext.Provider value={value} {...props} />
}

export const useYoga = (): typeof Yoga => {
  const { initYoga } = useContext(YogaContext)
  const yoga = useAsset(initYoga)
  return yoga
}
