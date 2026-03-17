import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PriceItem } from '@/lib/types/price-list'

type AvailabilityKey = 'in_stock' | 'limited' | 'out_of_stock' | 'coming_soon'

const availabilityVariant: Record<
  AvailabilityKey,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  in_stock: 'default',
  limited: 'outline',
  out_of_stock: 'destructive',
  coming_soon: 'secondary',
}

const availabilityTranslationKey: Record<AvailabilityKey, string> = {
  in_stock: 'inStock',
  limited: 'limited',
  out_of_stock: 'outOfStock',
  coming_soon: 'comingSoon',
}

export function PriceTable({ items }: { items: PriceItem[] }) {
  const t = useTranslations('priceTable')

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">{t('noItems')}</p>
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('product')}</TableHead>
            <TableHead>{t('style')}</TableHead>
            <TableHead>{t('abv')}</TableHead>
            <TableHead>{t('ibu')}</TableHead>
            <TableHead>{t('casePrice')}</TableHead>
            <TableHead>{t('kegPrice')}</TableHead>
            <TableHead>{t('pack')}</TableHead>
            <TableHead>{t('availability')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div>{item.product_name}</div>
                {item.category && (
                  <div className="text-xs text-muted-foreground">{item.category}</div>
                )}
              </TableCell>
              <TableCell>{item.style ?? '—'}</TableCell>
              <TableCell>{item.abv != null ? `${item.abv}%` : '—'}</TableCell>
              <TableCell>{item.ibu ?? '—'}</TableCell>
              <TableCell>
                {item.price_case != null ? `${item.price_case} ${item.currency}` : '—'}
              </TableCell>
              <TableCell>
                {item.price_keg != null ? `${item.price_keg} ${item.currency}` : '—'}
              </TableCell>
              <TableCell>{item.pack_size ?? '—'}</TableCell>
              <TableCell>
                {item.availability && item.availability in availabilityVariant ? (
                  <Badge variant={availabilityVariant[item.availability as AvailabilityKey]}>
                    {t(
                      availabilityTranslationKey[
                        item.availability as AvailabilityKey
                      ] as Parameters<typeof t>[0],
                    )}
                  </Badge>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
