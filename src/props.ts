import { YogaFlexDirection, YogaAlign, YogaJustifyContent, YogaFlexWrap, YogaUnit } from 'yoga-layout-prebuilt'

export type Value = string | number

export type FlexDirection = YogaFlexDirection | 'row' | 'column' | 'row-reverse' | 'column-reverse'

export type JustifyContent = YogaJustifyContent | 'center' | 'flex-end' | 'flex-start' | 'space-between' | 'space-evenly' | 'space-around'

export type Align = YogaAlign | 'auto' | 'baseline' | 'center' | 'flex-end' | 'flex-start' | 'space-around' | 'space-between' | 'stretch'

export type FlexWrap = YogaFlexWrap | 'no-wrap' | 'wrap' | 'wrap-reverse'

export type R3FlexProps = Partial<{
  // Align
  alignContent: Align
  alignItems: Align
  alignSelf: Align
  align: Align

  // Justify
  justifyContent: JustifyContent
  justify: JustifyContent

  // Direction
  flexDirection: FlexDirection
  flexDir: FlexDirection
  dir: FlexDirection

  // Wrap
  flexWrap: FlexWrap
  wrap: FlexWrap

  // Flex basis
  flexBasis: number

  // Grow & shrink
  flexGrow: number
  flexShrink: number

  // Height & width
  height: Value
  width: Value
  maxHeight: Value
  maxWidth: Value
  minHeight: Value
  minWidth: Value

  // Padding
  padding: Value
  p: Value
  paddingTop: Value
  pt: Value
  paddingBottom: Value
  pb: Value
  paddingLeft: Value
  pl: Value
  paddingRight: Value
  pr: Value

  // Margin
  margin: Value
  m: Value
  marginTop: Value
  mt: Value
  marginLeft: Value
  ml: Value
  marginRight: Value
  mr: Value
  marginBottom: Value
  mb: Value
}>
