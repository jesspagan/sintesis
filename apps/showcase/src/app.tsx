import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Nav, Button } from '@sintesis/ui'
import type { NavItem } from '@sintesis/ui'
import { Home } from './pages/home/home'
import { TokensPage } from './pages/tokens/tokens'
import { ComponentsPage } from './pages/components/components'
import { ChangelogPage } from './pages/changelog/changelog'
import { ButtonShowcase } from './pages/showcase/button-showcase'
import { InputShowcase } from './pages/showcase/input-showcase'
import { CardShowcase } from './pages/showcase/card-showcase'
import { BadgeShowcase } from './pages/showcase/badge-showcase'
import { TypographyShowcase } from './pages/showcase/typography-showcase'
import styles from './app.module.css'

const navItems: NavItem[] = [
  { label: 'tokens', to: '/tokens' },
  { label: 'components', to: '/components' },
  { label: 'changelog', to: '/changelog' },
]

function AppNav() {
  const location = useLocation()
  return (
    <Nav
      items={navItems}
      logoHref="/"
      logoLabel="síntesis"
      isActive={(item) => {
        if (item.exact) return location.pathname === item.to
        return location.pathname.startsWith(item.to)
      }}
      renderLink={(item, className) => (
        <NavLink
          to={item.to}
          className={className}
          aria-current={location.pathname.startsWith(item.to) ? 'page' : undefined}
        >
          {item.label}
        </NavLink>
      )}
      actions={
        <Button size="sm" as="a" href="https://github.com/sintesis-dev/sintesis" variant="secondary">
          github
        </Button>
      }
    />
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppNav />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/components/button" element={<ButtonShowcase />} />
          <Route path="/components/input" element={<InputShowcase />} />
          <Route path="/components/card" element={<CardShowcase />} />
          <Route path="/components/badge" element={<BadgeShowcase />} />
          <Route path="/components/typography" element={<TypographyShowcase />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
