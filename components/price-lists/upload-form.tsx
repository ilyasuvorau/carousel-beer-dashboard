'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from '@/i18n/navigation'

export function UploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const t = useTranslations('uploadForm')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      const res = await fetch('/api/extract/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      onSuccess?.()
      router.push(`/dashboard/price-lists/${json.priceListId}`)
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleUrl(e: React.FormEvent<HTMLFormElement>, type: 'doc' | 'sheet') {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const form = e.currentTarget
      const url = (form.elements.namedItem('url') as HTMLInputElement).value
      const name = (form.elements.namedItem('name') as HTMLInputElement)?.value
      const endpoint = type === 'doc' ? '/api/extract/google-doc' : '/api/extract/google-sheet'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Extraction failed')
      onSuccess?.()
      router.push(`/dashboard/price-lists/${json.priceListId}`)
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="file">
      <TabsList className="mb-4">
        <TabsTrigger value="file">{t('tabFile')}</TabsTrigger>
        <TabsTrigger value="google-doc">{t('tabGoogleDoc')}</TabsTrigger>
        <TabsTrigger value="google-sheet">{t('tabGoogleSheet')}</TabsTrigger>
      </TabsList>

      <TabsContent value="file">
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name-file">{t('nameLabel')}</Label>
            <Input id="name-file" name="name" placeholder={t('namePlaceholderGeneral')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="file">{t('fileLabel')}</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.docx,.xlsx" required />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? t('processing') : t('uploadButton')}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="google-doc">
        <form onSubmit={(e) => handleGoogleUrl(e, 'doc')} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name-doc">{t('nameLabel')}</Label>
            <Input id="name-doc" name="name" placeholder={t('namePlaceholderGeneral')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="url-doc">{t('googleDocUrlLabel')}</Label>
            <Input
              id="url-doc"
              name="url"
              type="url"
              placeholder={t('googleDocUrlPlaceholder')}
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? t('processing') : t('extractDocButton')}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="google-sheet">
        <form onSubmit={(e) => handleGoogleUrl(e, 'sheet')} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name-sheet">{t('nameLabel')}</Label>
            <Input id="name-sheet" name="name" placeholder={t('namePlaceholderBeer')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="url-sheet">{t('googleSheetUrlLabel')}</Label>
            <Input
              id="url-sheet"
              name="url"
              type="url"
              placeholder={t('googleSheetUrlPlaceholder')}
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? t('processing') : t('extractSheetButton')}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
