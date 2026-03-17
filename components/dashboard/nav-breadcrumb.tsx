'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

function isUuid(s: string) {
  return /^[0-9a-f-]{36}$/i.test(s)
}

export function NavBreadcrumb() {
  const t = useTranslations('dashboard')
  const pathname = usePathname()

  const LABELS: Record<string, string> = {
    'price-lists': t('priceLists'),
  }

  const segments = pathname.split('/').filter(Boolean)

  // Build crumbs, skip "dashboard" root, locale prefixes, and UUIDs
  const crumbs: { href: string; label: string }[] = []
  let href = ''
  for (const seg of segments) {
    href += `/${seg}`
    const isLocale = (routing.locales as readonly string[]).includes(seg)
    if (seg === 'dashboard' || isUuid(seg) || isLocale) continue
    crumbs.push({ href, label: LABELS[seg] ?? seg })
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-muted-foreground select-none">/</span>}
            {isLast ? (
              <span className="font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
