import { CheckCircle, FileText, Layers } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PriceListsTable } from '@/components/price-lists/price-lists-table'
import { UploadDialog } from '@/components/price-lists/upload-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import type { PriceList } from '@/lib/types/price-list'

export const dynamic = 'force-dynamic'

export default async function PriceListsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('priceLists')
  const supabase = await createClient()

  const [{ data: priceLists }, { count: itemsCount }] = await Promise.all([
    supabase.from('price_lists').select('*').order('created_at', { ascending: false }),
    supabase.from('price_items').select('*', { count: 'exact', head: true }),
  ])

  const lists = (priceLists ?? []) as PriceList[]
  const doneCount = lists.filter((l) => l.status === 'done').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <UploadDialog />
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('totalLists')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lists.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('priceListsImported')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lists.length > 0
                ? t('successRate', {
                    percent: Math.round((doneCount / lists.length) * 100),
                  })
                : t('noListsYet')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('itemsExtracted')}</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(itemsCount ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('acrossAllLists')}</p>
          </CardContent>
        </Card>
      </div>

      <PriceListsTable lists={lists} />
    </div>
  )
}
