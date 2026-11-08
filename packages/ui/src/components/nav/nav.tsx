import type { ReactNode } from 'react'
import styles from './nav.module.css'

export interface NavItem {
  label: string
  to: string
  exact?: boolean
}

export interface NavProps {
  items?: NavItem[]
  logoLabel?: string
  logoHref?: string
  actions?: ReactNode
  renderLink?: (item: NavItem, className: string) => ReactNode
  isActive?: (item: NavItem) => boolean
}

export function Nav({
  items = [],
  logoLabel = 'sintesis',
  logoHref = '/',
  actions,
  renderLink,
  isActive,
}: NavProps) {
  return (
    <nav className={styles.nav} aria-label="main navigation">
      <a href={logoHref} className={styles.logo} aria-label={`${logoLabel} home`}>
        {logoLabel}
      </a>
      {items.length > 0 && (
        <ul className={styles.links} role="list">
          {items.map((item) => {
            const active = isActive ? isActive(item) : false
            const linkClass = [styles.link, active ? styles['link-active'] : ''].filter(Boolean).join(' ')

            return (
              <li key={item.to}>
                {renderLink ? (
                  renderLink(item, linkClass)
                ) : (
                  <a href={item.to} className={linkClass} aria-current={active ? 'page' : undefined}>
                    {item.label}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {actions && <div className={styles.actions}>{actions}</div>}
    </nav>
  )
}
