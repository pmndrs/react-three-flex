import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Flex, Box } from '../../src'
import { Setup } from '../Setup'

const List = ({ width, height }: { width: number; height: number }) => {
  return (
    <Flex position={[-width / 2, height / 2, -2]} size={[width, height, 0]} flexDirection="row" flexWrap="wrap">
      {new Array(8).fill(undefined).map((_, i) => (
        <Box margin={0.3} key={i} width={1.6} height={2} centerAnchor>
          {(width, height) => (
            <mesh>
              <planeBufferGeometry args={[width, height]} />
              <meshBasicMaterial color={0x0000ff} />
            </mesh>
          )}
        </Box>
      ))}
    </Flex>
  )
}

export default {
  title: 'Example/List',
  component: List,
} as ComponentMeta<typeof List>

const Template: ComponentStory<typeof List> = (args) => (
  <Setup>
    <List {...args} />
  </Setup>
)

export const Primary = Template.bind({})
Primary.args = {
  width: 12,
  height: 7,
}
