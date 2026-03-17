'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UploadForm } from './upload-form'

export function UploadDialog() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('uploadForm')
  const tPriceLists = useTranslations('priceLists')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        {tPriceLists('importButton')}
      </Button>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>{t('dialogTitle')}</DialogTitle>
        </DialogHeader>
        <UploadForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
