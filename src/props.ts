import { YogaFlexDirection, YogaAlign, YogaJustifyContent, YogaFlexWrap, YogaUnit } from 'yoga-layout'

declare class Value {
  readonly unit: YogaUnit | number
  readonly value: number

  constructor(unit: YogaUnit | number, value: number)

  fromJS(expose: (unit: YogaUnit | number, value: number) => any): void

  toString(): string
  valueOf(): number
}

export type YogaFlexProps = Partial<{
  // Align
  alignContent: YogaAlign
  alignItems: YogaAlign
  alignSelf: YogaAlign
  align: YogaAlign

  // Justify
  justifyContent: YogaJustifyContent
  justify: YogaJustifyContent

  // Direction
  flexDirection: YogaFlexDirection
  flexDir: YogaFlexDirection

  // Wrap
  flexWrap: YogaFlexWrap

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
