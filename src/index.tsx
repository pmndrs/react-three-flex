import React, { PropsWithChildren, useCallback } from 'react'
import Yoga from 'yoga-layout-prebuilt'
import { YogaProvider } from './YogaProvider'

export * from './Box'
export * from './Flex'
export * from './props'
export * from './hooks'
export type { Axis } from './util'

export const YogaPrebuiltProvider = (props: PropsWithChildren<{}>) => {
  const initYoga = useCallback(() => Promise.resolve(Yoga), [])
  return <YogaProvider initYoga={initYoga} {...props} />
}
