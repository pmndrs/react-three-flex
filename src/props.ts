import { YogaFlexDirection, YogaAlign, YogaJustifyContent, YogaFlexWrap, YogaUnit } from 'yoga-layout-prebuilt'

declare class Value {
  readonly unit: YogaUnit | number
  readonly value: number

  constructor(unit: YogaUnit | number, value: number)

  fromJS(expose: (unit: YogaUnit | number, value: number) => any): void

  toString(): string
  valueOf(): number
}

export type FlexDirection = YogaFlexDirection | 'row' | 'column' | 'row-reverse' | 'column-reverse'

export type JustifyContent = YogaJustifyContent | 'center' | 'flex-end' | 'flex-start' | 'space-between' | 'space-evenly' | 'space-around'

export type FlexWrap = YogaFlexWrap | 'no-wrap' | 'wrap' | 'wrap-reverse'

export type R3FlexProps = Partial<{
  // Align
  alignContent: YogaAlign
  alignItems: YogaAlign
  alignSelf: YogaAlign
  align: YogaAlign

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

  // Padding & margin
  padding: Value
  margin: Value
}>
