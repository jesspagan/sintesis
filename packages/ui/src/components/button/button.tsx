import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'
import styles from './button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  as?: ElementType
  // passthrough for polymorphic usage
  to?: string
  href?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  className,
  children,
  as: Tag = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading
  const classes = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles['full-width'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick =
    isDisabled && Tag !== 'button'
      ? (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation() }
      : onClick

  return (
    <Tag
      className={classes}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={Tag !== 'button' ? isDisabled || undefined : undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          {children}
        </>
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </Tag>
  )
}
