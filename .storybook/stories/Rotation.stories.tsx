import { Box, Flex } from '../../src'
import React, { Suspense } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Setup } from '../Setup'
import { MathUtils } from 'three'

const { degToRad } = MathUtils

const Rotation = ({
  rotationX,
  rotationY,
  rotationZ,
  rotationXItems,
  rotationYItems,
  rotationZItems,
}: {
  rotationX: number
  rotationY: number
  rotationZ: number
  rotationXItems: number
  rotationYItems: number
  rotationZItems: number
}) => {
  const width = 3
  const height = 1
  return (
    <Flex
      size={[width, height, 0]}
      flexDirection="row"
      flexWrap="no-wrap"
      alignItems="stretch"
      justifyContent="flex-start"
      position={[0, 0, 3]}
      rotation={[degToRad(rotationX), degToRad(rotationY), degToRad(rotationZ)]}
    >
      <Box rotation={[degToRad(rotationXItems), degToRad(rotationYItems), degToRad(rotationZItems)]} centerAnchor>
        <mesh scale={1}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
      </Box>
      <Box rotation={[degToRad(rotationXItems), degToRad(rotationYItems), degToRad(rotationZItems)]} centerAnchor>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="orange" wireframe />
        </mesh>
      </Box>
    </Flex>
  )
}

export default {
  title: 'Example/Rotation',
  component: Rotation,
} as ComponentMeta<typeof Rotation>

const Template: ComponentStory<typeof Rotation> = (args) => (
  <Setup lights={false}>
    <Suspense fallback={null}>
      <Rotation {...args} />
    </Suspense>
  </Setup>
)

export const RootRotated = Template.bind({})
RootRotated.args = {
  rotationX: 10,
  rotationY: 30,
  rotationZ: 10,
  rotationXItems: 0,
  rotationYItems: 0,
  rotationZItems: 0,
}

export const ItemsRotated = Template.bind({})
ItemsRotated.args = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  rotationXItems: 0,
  rotationYItems: 45,
  rotationZItems: 0,
}
