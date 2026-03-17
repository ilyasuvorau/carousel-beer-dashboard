import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ru', 'be', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
})
