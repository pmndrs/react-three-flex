import { GroupProps } from '@react-three/fiber'
import React, { forwardRef, useRef } from 'react'
import { Group } from 'three'
import mergeRefs from 'react-merge-refs'
import { boxReferenceContext } from './context'

export const ReferenceGroup = forwardRef<Group, GroupProps>(({ children, ...props }, ref) => {
  const group = useRef<Group>()
  return (
    <group ref={mergeRefs([group, ref])} {...props}>
      <boxReferenceContext.Provider value={group}>{children}</boxReferenceContext.Provider>
    </group>
  )
})
