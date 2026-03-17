'use client'

import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signInWithEmail } from '@/app/actions/auth'
import { LocaleSwitcher } from '@/components/shared/locale-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SubmitButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('login')
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t('signingIn') : t('signIn')}
    </Button>
  )
}

export default function LoginPage() {
  const [state, action] = useActionState(signInWithEmail, null)
  const t = useTranslations('login')

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <title>Logo</title>
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Beer Dashboard
        </div>
        <div className="mt-auto">
          <blockquote className="space-y-2" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex justify-end">
            <LocaleSwitcher />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('subtitle')}</p>
          </div>

          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  )
}
