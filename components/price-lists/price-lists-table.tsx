'use client'

import { Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { deleteList } from '@/app/actions/price-lists'
import { ExtractionStatus } from '@/components/price-lists/extraction-status'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from '@/i18n/navigation'
import type { PriceList } from '@/lib/types/price-list'

interface Props {
  lists: PriceList[]
}

const SOURCE_TYPE_KEYS = new Set(['pdf', 'docx', 'xlsx', 'google_doc', 'google_sheet'])

export function PriceListsTable({ lists }: Props) {
  const t = useTranslations('priceLists')
  const tSource = useTranslations('sourceTypes')
  const locale = useLocale()

  if (lists.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('noLists')}</p>
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">{t('name')}</TableHead>
            <TableHead>{t('type')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('extracted')}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((pl) => (
            <TableRow key={pl.id}>
              <TableCell className="pl-4 font-medium">
                <Link
                  href={`/dashboard/price-lists/${pl.id}`}
                  className="hover:underline underline-offset-4"
                >
                  {pl.name}
                </Link>
                {pl.error_message && (
                  <p className="text-xs text-destructive mt-0.5 font-normal">{pl.error_message}</p>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {SOURCE_TYPE_KEYS.has(pl.source_type)
                  ? tSource(pl.source_type as Parameters<typeof tSource>[0])
                  : pl.source_type}
              </TableCell>
              <TableCell>
                <ExtractionStatus status={pl.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {pl.extracted_at
                  ? new Date(pl.extracted_at).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </TableCell>
              <TableCell>
                <form action={deleteList.bind(null, pl.id)}>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="submit"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
