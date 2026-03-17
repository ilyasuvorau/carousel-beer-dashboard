import Link from 'next/link'
import { ExtractionStatus } from '@/components/price-lists/extraction-status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PriceList } from '@/lib/types/price-list'

interface PriceListCardProps {
  priceList: PriceList
}

export function PriceListCard({ priceList }: PriceListCardProps) {
  return (
    <Link href={`/dashboard/price-lists/${priceList.id}`}>
      <Card className="hover:border-neutral-400 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{priceList.name}</CardTitle>
            <ExtractionStatus status={priceList.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              Type: <span className="font-medium text-foreground">{priceList.source_type}</span>
            </div>
            {priceList.extracted_at && (
              <div>
                Extracted:{' '}
                <span className="font-medium text-foreground">
                  {new Date(priceList.extracted_at).toLocaleDateString()}
                </span>
              </div>
            )}
            {priceList.error_message && (
              <div className="text-destructive text-xs mt-1">{priceList.error_message}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
