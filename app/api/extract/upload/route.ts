// app/api/extract/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { parseDocx } from '@/lib/extractors/docx'
import { extractPriceItems } from '@/lib/extractors/llm'
import { parsePdf } from '@/lib/extractors/pdf'
import { parseXlsx } from '@/lib/extractors/xlsx'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

type SourceType = 'pdf' | 'docx' | 'xlsx'

function detectSourceType(file: File): SourceType | null {
  const mime = file.type.toLowerCase()
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (mime === 'application/pdf' || ext === 'pdf') {
    return 'pdf'
  }
  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    return 'docx'
  }
  if (
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    ext === 'xlsx'
  ) {
    return 'xlsx'
  }
  return null
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const supabase = await createClient()
  let priceListId: string | null = null

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const name = (formData.get('name') as string) || file?.name || 'Unnamed price list'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const sourceType = detectSourceType(file)
    if (!sourceType) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
    }

    // Create price_list record
    const { data: priceList, error: insertError } = await supabase
      .from('price_lists')
      .insert({ name, source_type: sourceType, status: 'processing' })
      .select('id')
      .single()

    if (insertError || !priceList) {
      throw new Error(insertError?.message ?? 'Failed to create price list')
    }
    priceListId = priceList.id

    // Parse file
    const buffer = Buffer.from(await file.arrayBuffer())
    let content: string | { type: 'pdf_base64'; data: string }

    if (sourceType === 'pdf') {
      const result = await parsePdf(buffer)
      content =
        result.type === 'pdf_base64' ? { type: 'pdf_base64', data: result.data } : result.content
    } else if (sourceType === 'docx') {
      content = await parseDocx(buffer)
    } else {
      content = parseXlsx(buffer)
    }

    // Extract with LLM
    const items = await extractPriceItems(content)

    // Insert items
    if (items.length > 0) {
      const { error: itemsError } = await supabase.from('price_items').insert(
        items.map((item) => ({
          ...item,
          price_list_id: priceListId,
          currency: item.currency ?? 'RUB',
        })),
      )
      if (itemsError) throw new Error(itemsError.message)
    }

    // Update status to done
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
    console.error('[upload]', error)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
