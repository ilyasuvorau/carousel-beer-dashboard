import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const supabase = await createClient()

  const { data: priceList, error: listError } = await supabase
    .from('price_lists')
    .select('*')
    .eq('id', id)
    .single()

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 404 })
  }

  const { data: items, error: itemsError } = await supabase
    .from('price_items')
    .select('*')
    .eq('price_list_id', id)
    .order('category', { ascending: true })
    .order('product_name', { ascending: true })

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  return NextResponse.json({ ...priceList, items })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const supabase = await createClient()

  const { error } = await supabase.from('price_lists').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
