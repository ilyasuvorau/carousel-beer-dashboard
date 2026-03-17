'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

type Status = 'pending' | 'processing' | 'done' | 'error'

const statusVariant: Record<Status, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  processing: 'outline',
  done: 'default',
  error: 'destructive',
}

export function ExtractionStatus({ status }: { status: Status }) {
  const t = useTranslations('extractionStatus')
  const variant = statusVariant[status] ?? statusVariant.pending
  return (
    <Badge variant={variant} className="gap-1">
      {status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
      {t(status)}
    </Badge>
  )
}
