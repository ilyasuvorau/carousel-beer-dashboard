import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('price_lists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
