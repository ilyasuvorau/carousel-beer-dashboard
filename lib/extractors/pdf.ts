// lib/extractors/pdf.ts
export type PdfResult = { type: 'text'; content: string } | { type: 'pdf_base64'; data: string }

export async function parsePdf(buffer: Buffer): Promise<PdfResult> {
  if (process.env.LLM_PROVIDER === 'anthropic') {
    return { type: 'pdf_base64', data: buffer.toString('base64') }
  }
  const { extractText } = await import('unpdf')
  const { text } = await extractText(new Uint8Array(buffer))
  return { type: 'text', content: text.join('\n') }
}
