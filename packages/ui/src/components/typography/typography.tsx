import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import styles from './typography.module.css'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
type HeadingColor = 'primary' | 'secondary' | 'brand' | 'inverse'
type TextVariant = 'body' | 'caption' | 'label' | 'code'
type TextColor = 'primary' | 'secondary' | 'brand' | 'disabled' | 'inverse'
type FontWeight = 'regular' | 'medium' | 'semibold'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  size?: HeadingLevel
  color?: HeadingColor
  lowercase?: boolean
  children: ReactNode
}

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant
  color?: TextColor
  weight?: FontWeight
  as?: ElementType
  children: ReactNode
}

export function Heading({
  as: Tag = 'h2',
  size,
  color = 'primary',
  lowercase = true,
  className,
  children,
  ...rest
}: HeadingProps) {
  const resolvedSize = size ?? Tag
  const classes = [
    styles.heading,
    styles[`heading-${resolvedSize}`],
    color !== 'primary' ? styles[`heading-${color}`] : '',
    !lowercase ? styles['heading-uppercase'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}

export function Text({
  variant = 'body',
  color,
  weight,
  as: Tag = 'p',
  className,
  children,
  ...rest
}: TextProps) {
  const classes = [
    styles.text,
    styles[`text-${variant}`],
    color ? styles[`text-${color}`] : '',
    weight ? styles[`weight-${weight}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}
