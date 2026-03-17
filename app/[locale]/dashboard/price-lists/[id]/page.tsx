import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ExtractionStatus } from '@/components/price-lists/extraction-status'
import { PriceTable } from '@/components/price-lists/price-table'
import { ProcessingPoller } from '@/components/price-lists/processing-poller'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import type { PriceItem, PriceList } from '@/lib/types/price-list'

export const dynamic = 'force-dynamic'

export default async function PriceListDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('priceListDetail')
  const tSource = await getTranslations('sourceTypes')

  const supabase = await createClient()

  const { data: priceList } = await supabase.from('price_lists').select('*').eq('id', id).single()
  if (!priceList) notFound()

  const { data: items } = await supabase
    .from('price_items')
    .select('*')
    .eq('price_list_id', id)
    .order('category', { ascending: true })
    .order('product_name', { ascending: true })

  const pl = priceList as PriceList

  const sourceLabel = tSource(pl.source_type as Parameters<typeof tSource>[0])

  return (
    <div className="space-y-6">
      <ProcessingPoller status={pl.status} />

      <div className="space-y-1">
        <Link
          href="/dashboard/price-lists"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t('backLink')}
        </Link>
        <div className="flex items-center gap-3 pt-1">
          <h1 className="text-2xl font-semibold tracking-tight">{pl.name}</h1>
          <ExtractionStatus status={pl.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {sourceLabel}
          {pl.extracted_at &&
            ` · ${t('extracted')} ${new Date(pl.extracted_at).toLocaleDateString(locale)}`}
          {pl.source_url && (
            <>
              {' · '}
              <a
                href={pl.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                {t('source')}
              </a>
            </>
          )}
        </p>
      </div>

      {pl.error_message && (
        <div className="text-destructive text-sm bg-destructive/10 rounded-md p-3">
          {pl.error_message}
        </div>
      )}

      <PriceTable items={(items ?? []) as PriceItem[]} />
    </div>
  )
}
