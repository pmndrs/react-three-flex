# react-three-flex 💠

`<Flex />` component for the 3D World. Inspired by the [yoga-r3f demo](https://codesandbox.io/s/yoga-r3f-lgl0j).

## Installation

```sh
npm i react-three-flex
```

## Example

```jsx
import React from 'react'
import { Flex, Box } from 'react-three-flex'

const Layout = () => (
  <Flex justifyContent="center" alignItems="center">
    <Box>{/* Your 3D component*/}</Box>
  </Flex>
)
```

## Usage

The layout works with two components, `<Flex />` as container and `<Box />` for items.

You simply wrap your 3D objects in different `<Box />` instances inside a flex container. This way they will be automatically placed in the 3D space like a DOM Flexbox.

```jsx
import React from 'react'
import { Flex, Box } from 'react-three-flex'

const Layout = () => (
  <Flex justifyContent="center" alignItems="center">
    <Box>
      <Sphere />
    </Box>

    <Box flexGrow={1}>
      <TorusKnot />
    </Box>

    <Box>
      <Icosahedron />
    </Box>
  </Flex>
)
```

You can tweak the container and the boxes using standard CSS flex properties, like `flexDirection`, `justifyContent` for the container and `flexGrow` for the items. See props docs below for more info.

### Sizing

The main difference between a DOM Flexbox and react-three-flex is that you don't have a parent container for the root flex, so you'll need to specify its dimensions using `size` prop, if you want it to be centered and perform grows or wrapping.

```jsx
const Layout = () => (
  <Flex flexWrap="wrap" size={[50, 50, 50]}>
    <Box>
      <Sphere />
    </Box>
    <Box flexGrow={1}>
      <TorusKnot />
    </Box>
    <Box>
      <Icosahedron />
    </Box>
  </Flex>
)
```

### Nesting

Since a `<Flex />` component works the same way as a DOM one, you can easily make complex layouts by nesting flex containers.

```jsx
const Layout = () => (
  <Flex flexDirection="row" flexWrap="wrap" size={[50, 0, 0]}>
    <Box>
      <Sphere />
    </Box>
    <Box>
      <Flex flexDirection="column" flexWrap="no-wrap">
        <Sphere />
        <Sphere />
        <Sphere />
      </Flex>
    </Box>
    <Box>
      <Icosahedron />
    </Box>
  </Flex>
)
```

### Containers

...

### Props

...

## License

[MIT](LICENSE)
