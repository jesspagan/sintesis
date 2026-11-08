import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './input.module.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export function Input({
  label,
  helperText,
  error,
  size = 'md',
  iconLeft,
  iconRight,
  id: idProp,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  const wrapperClasses = [
    styles.wrapper,
    styles[`size-${size}`],
    error ? styles.error : '',
    iconLeft ? styles['has-icon-left'] : '',
    iconRight ? styles['has-icon-right'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles['input-wrap']}>
        {iconLeft && (
          <span className={`${styles.icon} ${styles['icon-left']}`} aria-hidden="true">
            {iconLeft}
          </span>
        )}
        <input id={id} className={styles.input} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined} {...rest} />
        {iconRight && (
          <span className={`${styles.icon} ${styles['icon-right']}`} aria-hidden="true">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className={styles['error-msg']}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${id}-helper`} className={styles.helper}>
          {helperText}
        </span>
      )}
    </div>
  )
}
