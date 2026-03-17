'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteList(id: string) {
  const supabase = await createClient()
  await supabase.from('price_items').delete().eq('price_list_id', id)
  await supabase.from('price_lists').delete().eq('id', id)
  revalidatePath('/dashboard/price-lists')
}
