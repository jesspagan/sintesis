import type { HTMLAttributes } from 'react'
import styles from './divider.module.css'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  color?: 'default' | 'strong'
  spacing?: 'sm' | 'md' | 'lg'
}

export function Divider({ label, color = 'default', spacing = 'md', className, ...rest }: DividerProps) {
  const classes = [
    styles.divider,
    label ? styles['has-label'] : '',
    styles[`spacing-${spacing}`],
    color !== 'default' ? styles[`color-${color}`] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div role="separator" className={classes} {...rest}>
      {label}
    </div>
  )
}
