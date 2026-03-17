import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { fetchGoogleSheet } from '@/lib/extractors/google-sheets'
import { extractPriceItems } from '@/lib/extractors/llm'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const supabase = await createClient()
  let priceListId: string | null = null

  try {
    const { url, name } = await request.json()
    if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 })

    const { data: priceList, error: insertError } = await supabase
      .from('price_lists')
      .insert({
        name: name ?? url,
        source_type: 'google_sheet',
        source_url: url,
        status: 'processing',
      })
      .select('id')
      .single()

    if (insertError || !priceList) throw new Error(insertError?.message ?? 'Insert failed')
    priceListId = priceList.id

    const content = await fetchGoogleSheet(url)
    const items = await extractPriceItems(content)

    if (items.length > 0) {
      const { error } = await supabase.from('price_items').insert(
        items.map((item) => ({
          ...item,
          price_list_id: priceListId,
          currency: item.currency ?? 'RUB',
        })),
      )
      if (error) throw new Error(error.message)
    }

    await supabase
      .from('price_lists')
      .update({ status: 'done', extracted_at: new Date().toISOString() })
      .eq('id', priceListId)

    return NextResponse.json({ priceListId })
  } catch (error) {
    if (priceListId) {
      const supabase2 = await createClient()
      await supabase2
        .from('price_lists')
        .update({ status: 'error', error_message: String(error) })
        .eq('id', priceListId)
    }
    console.error('[google-sheet]', error)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
