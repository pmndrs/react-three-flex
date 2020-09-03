# react-three-flex

[![Travis CI](https://img.shields.io/travis/react-spring/react-three-flex?style=flat-square)](https://travis-ci.org/react-spring/react-three-flex) [![npm](https://img.shields.io/npm/v/react-three-flex?style=flat-square)](https://www.npmjs.com/package/react-three-flex) ![npm](https://img.shields.io/npm/dt/react-three-flex.svg?style=flat-square) [![Discord Shield](https://discordapp.com/api/guilds/740090768164651008/widget.png?style=shield)](https://discord.gg/ZZjjNvJ)

Placing content in threejs is hard.
**`react-three-flex`** brings the web flexbox spec to [react-three-fiber](https://github.com/react-spring/react-three-fiber).
It is based on [yoga](https://github.com/facebook/yoga), Facebook's open source layout engine for react-native.
Think of how you would normally go about making content responsive, stick to the sides, wrap around, grids, rows, columns, padding, margin. Especially if you are working on frontend-centric projects where the camera is pointing down, forming a 2-dimensional view.

You can try a live demo here: ...

```bash
npm install react-three-flex
```

## Usage

You simply create layouts by wrapping your 3D objects in different `<Box />` instances inside a `<Flex />` container. This way they will be automatically placed in the 3D space following the flexbox specification, just like in the DOM.

```jsx
import { Flex, Box } from 'react-three-flex'

const Layout = () => (
  <Flex justifyContent="center" alignItems="center">
    <Box>
      <mesh geometry={box} />
    </Box>
    <Box flexGrow={1}>
      <mesh geometry={torus} />
    </Box>
    <Box>
      <mesh geometry={sphere} />
    </Box>
  </Flex>
)
```

You can tweak the container and the boxes using standard CSS flex properties, like `flexDirection` or `justifyContent` for the container and `flexGrow` for the boxes. There are also _shorthands_, like `align` and `justify`. See props docs below for more info.

### Invalidation and Reflow

While DOM's Flexbox has full control over all the changes of the tree, `react-three-flex` runs on React, hence it has no way to know if a children size or shape has changed. For performance reasons Flex layout calculation _does not run every frame_, and it has to be triggered manually in some cases.

**What will trigger a reflow:**

- `<Flexbox/>` props changes (alignItems, size, ...)
- `<Box/>` props changes (flexGrow, margin, ...)
- `<Flexbox/>` and `<Box/>` rerenders with children differences

```jsx
function AnimatedBox() {
  // Since <Box/> is inside the component, setting the state will rerender it, thus causing a reflow.
  // ⚠️ If <Box/> were outside this component, this would NOT cause a reflow!
  const [state, setState] = useState(true)
  useInterval(() => setState((s) => !s), 1000)
  return (
    <Box>
      <mesh>
        <boxBufferGeometry attach="geometry" args={[state ? 10 : 30, 10, 10]} />
      </mesh>
    </Box>
  )
}
```

**This will NOT cause a reflow!**

```jsx
function AnimatedBox() {
  // ⚠️ Setting state does not rerender <Box/> since it's in the parent
  // ‼️ No Reflow!!
  const [state, setState] = useState(true)
  useInterval(() => setState((s) => !s), 1000)
  return (
    <mesh>
      <boxBufferGeometry attach="geometry" args={[state ? 10 : 30, 10, 10]} />
    </mesh>
  )
}
function Layout() {
  return (
    <Flex>
      <Box>
        <AnimatedBox />
      </Box>
    </Flex>
  )
}
```

For every other cases (setting size with an `useFrame`, react-spring animations, `<Box/>` not rerendered) you'll need to **manually cause a reflow**, using `useReflow()` hook. Reflows requests are batched every frame, so you can call it from hundreds of components without performance issues.

**Animation with useFrame():**

```jsx
function AnimatedBox() {
  const ref = useRef()
  const reflow = useReflow()
  useFrame(({ clock }) => {
    ref.current.scale.x = 1 + Math.sin(clock.getElapsed())
    reflow()
  })
  return (
    <Box>
      <mesh ref={ref}>
        <boxBufferGeometry attach="geometry" args={[10, 10, 10]} />
      </mesh>
    </Box>
  )
}
```

**`<Box/>` outside of component:**

```jsx
function AnimatedBox() {
  const [state, setState] = useState(true)
  useInterval(() => setState((s) => !s), 1000)
  const reflow = useReflow()
  useEffect(reflow, [state])
  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={[state ? 10 : 30, 10, 10]} />
    </mesh>
  )
}
```

### Sizing

`react-three-flex` differs from DOM Flexbox in that it rely on a parent container for the root flex. It is required to specify its dimensions using `size` prop for centering, wrapping, and to be responsive.

```jsx
<Flex flexDirection="row" flexWrap="wrap" size={[300, 200, 0]}>
  <Box>
    <mesh geometry={sphere} />
  </Box>
  <Box>
    <mesh geometry={torus} />
  </Box>
  <Box>
    <mesh geometry={icosahedron} />
  </Box>
</Flex>
```

**⚠️ WATCH OUT!** Yoga flexbox engine uses integer numbers to perform layout calculation, so to preserve precision `react-three-flex` multiplies every element size and flex prop by the `scaleFactor` of the root flex container. By default it's `100`, and works well for small scenes. If you use a different scene scale, make sure to tweak it accordingly.

![Bounds](./docs/bounds.png)

### Axis Orientation

Another important difference with DOM Flexbox is that you have to specify the plane of the container in 3D. The elements will be positioned in the 2D plane given by the two axes, using width and height calculated along the two axes.

The 2D flex container width and height will be calculated by looking at the `size` prop with respect of the chosen axes (100 for xy and 200 for y in this example).

The default plane is `xy`, the other possibilites are `yz` and `xz`.

```jsx
<Flex plane="xy" size={[100, 200, 0]}>
  {/* ... */}
</Flex>
```

![Axes Orientation](./docs/axes_orientation.png)

### Margin and Padding

For every `<Flex />` and `<Box />` component you can specify the margin and padding like in DOM elements.

```jsx
<Flex flexDirection="row" size={[300, 200, 0]} padding={30} margin={5}>
  <Box padding={5} margin={5}>
    <mesh geometry={sphere} />
  </Box>
  <Box padding={5} margin={5}>
    <mesh geometry={torus} />
  </Box>
</Flex>
```

![Margin](./docs/margin.png)

### Nesting

Since a `<Flex />` component works the same way as a DOM one, you can easily make complex layouts by nesting flex containers.

```jsx
<Flex flexDirection="row" flexWrap="wrap" size={[50, 0, 0]}>
  <Box>
    <mesh geometry={sphere} />
  </Box>
  <Box>
    <Flex flexDirection="column" flexWrap="no-wrap">
      <Box>
        <mesh geometry={sphere} />
      </Box>
      <Box>
        <mesh geometry={box} />
      </Box>
    </Flex>
  </Box>
</Flex>
```

## API

```jsx
<Flex
  size={[1, 1, 1]} // Total size of the flex container, see above
  position={[0, 0, 0]} // Default - position for the flex container in the scene
  direction="ltr" // Default - right to left or right to left
  plane="xy" // Default - plane axes, see above
  scaleFactor={100} // Default - integer scale factor, see above (Sizing)
  {...R3FlexProps} // Standard Flexbox props, described below
>
  <Box>{/* ... */}</Box>
</Flex>
```

### Flexbox props

Both `<Flex/>` and `<Box />` components shares the same Flexbox props API from Yoga. The library also provides string and number inputs for convenience and shorthands.

Example:

```jsx
// Flex with padding top set to 10, alignItems to 'center', justifyContent to 'space-around' and flexWrap to 'wrap'
<Flex pt={10} align="center" justify="space-around" wrap="wrap">
  <Box />
</Flex>
```

You can find a full list of props inside [`R3FlexProps` type](https://github.com/react-spring/react-three-flex/blob/d6dbd7fd5501d1122f7eb121d620affd1af24988/src/props.ts#L29).
