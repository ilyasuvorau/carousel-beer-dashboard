import { LayoutList, LogOut } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { signOut } from '@/app/actions/auth'
import { NavBreadcrumb } from '@/components/dashboard/nav-breadcrumb'
import { LocaleSwitcher } from '@/components/shared/locale-switcher'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('dashboard')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r flex flex-col bg-background">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <title>Logo</title>
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="font-semibold text-sm">{t('appName')}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <Link
            href="/dashboard/price-lists"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LayoutList className="h-4 w-4 shrink-0" />
            {t('priceLists')}
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t p-3 space-y-2">
          <LocaleSwitcher />
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
              {initial}
            </div>
            <span className="flex-1 min-w-0 truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                title={t('signOut')}
                className="flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-6">
          <NavBreadcrumb />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
