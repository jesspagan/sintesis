import type { CSSProperties, ElementType, HTMLAttributes } from 'react'

type GapKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32'
type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse'
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  direction?: Direction
  gap?: GapKey
  align?: Align
  justify?: Justify
  wrap?: boolean
  inline?: boolean
}

const justifyMap: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

export function Stack({
  as: Tag = 'div',
  direction = 'column',
  gap,
  align,
  justify,
  wrap = false,
  inline = false,
  style,
  children,
  ...rest
}: StackProps) {
  const inlineStyles: CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: direction,
    ...(gap ? { gap: `var(--gnrc-space-${gap})` } : {}),
    ...(align ? { alignItems: align === 'start' || align === 'end' ? `flex-${align}` : align } : {}),
    ...(justify ? { justifyContent: justifyMap[justify] } : {}),
    ...(wrap ? { flexWrap: 'wrap' } : {}),
    ...style,
  }

  return (
    <Tag style={inlineStyles} {...rest}>
      {children}
    </Tag>
  )
}
