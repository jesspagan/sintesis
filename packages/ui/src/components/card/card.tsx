import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import styles from './card.module.css'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'flat' | 'raised' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  header?: ReactNode
  footer?: ReactNode
  as?: ElementType
}

export function Card({
  variant = 'raised',
  padding = 'md',
  header,
  footer,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [
    styles.card,
    styles[`variant-${variant}`],
    styles[`padding-${padding}`],
    header ? styles['has-header'] : '',
    footer ? styles['has-footer'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...rest}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Tag>
  )
}
