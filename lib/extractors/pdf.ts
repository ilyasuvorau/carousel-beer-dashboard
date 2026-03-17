// lib/extractors/pdf.ts
import { PDFParse } from 'pdf-parse'

export type PdfResult = { type: 'text'; content: string } | { type: 'pdf_base64'; data: string }

export async function parsePdf(buffer: Buffer): Promise<PdfResult> {
  if (process.env.LLM_PROVIDER === 'anthropic') {
    return { type: 'pdf_base64', data: buffer.toString('base64') }
  }
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  return { type: 'text', content: result.text }
}
