// lib/extractors/llm.ts
// Unified LLM extraction interface
// LLM_PROVIDER=ollama  → uses openai SDK with OLLAMA_BASE_URL (default, free)
// LLM_PROVIDER=anthropic → uses @anthropic-ai/sdk with ANTHROPIC_API_KEY (paid, better quality)

import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

import { ExtractedItemSchema, type ExtractedItem } from '@/lib/types/price-list'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PdfContent = { type: 'pdf_base64'; data: string }
export type ExtractionContent = string | PdfContent

export class LLMExtractionError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'LLMExtractionError'
  }
}

export class UnsupportedContentTypeError extends LLMExtractionError {
  constructor(provider: string) {
    super(`Provider "${provider}" does not support PDF base64 content. Use plain text instead.`)
    this.name = 'UnsupportedContentTypeError'
  }
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are extracting a beer wholesale price list from a document.
The document may be in Russian or English.

Return a JSON array where each element has:
- product_name: string (required)
- style: string | null — e.g. "West Coast IPA"
- description: string | null — beer description text
- abv: number | null — e.g. 6.5
- ibu: number | null — bitterness units
- category: string | null — section/category in the document
- price_case: number | null — price per case/box/can
- price_keg: number | null — price per keg or per liter
- pack_size: string | null — e.g. "12x0.33L", "20L"
- currency: string — default "RUB"
- availability: "in_stock" | "limited" | "out_of_stock" | "coming_soon" | null
  (map Russian: "В наличии"→"in_stock", "В ограниченном количестве"→"limited",
   "Закончилось"→"out_of_stock", "Ожидается"→"coming_soon")
- image_url: string | null — label image URL
- bottling_date: string | null — ISO date format (YYYY-MM-DD)
- notes: string | null

Return ONLY the JSON array, no explanation.`

// ─── JSON parsing & validation ────────────────────────────────────────────────

function parseAndValidate(raw: string): ExtractedItem[] {
  let parsed: unknown
  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    parsed = JSON.parse(cleaned)
  } catch (err) {
    throw new LLMExtractionError(`Failed to parse LLM response as JSON: ${String(err)}`, err)
  }

  const result = ExtractedItemSchema.array().safeParse(parsed)
  if (!result.success) {
    throw new LLMExtractionError(
      `LLM response failed schema validation: ${result.error.message}`,
      result.error,
    )
  }

  return result.data
}

// ─── Anthropic implementation ─────────────────────────────────────────────────

async function extractWithAnthropic(content: ExtractionContent): Promise<ExtractedItem[]> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  type MessageParam = Anthropic.Messages.MessageParam

  let messages: MessageParam[]

  if (typeof content === 'string') {
    messages = [
      {
        role: 'user',
        content: `${content}\n\n${EXTRACTION_PROMPT}`,
      },
    ]
  } else {
    messages = [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: content.data,
            },
          } as Anthropic.Messages.DocumentBlockParam,
          {
            type: 'text',
            text: EXTRACTION_PROMPT,
          },
        ],
      },
    ]
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages,
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new LLMExtractionError('Anthropic response contained no text block')
  }

  return parseAndValidate(textBlock.text)
}

// ─── Ollama implementation ────────────────────────────────────────────────────

async function extractWithOllama(content: ExtractionContent): Promise<ExtractedItem[]> {
  if (typeof content !== 'string') {
    throw new UnsupportedContentTypeError('ollama')
  }

  const client = new OpenAI({
    baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
    apiKey: 'ollama',
  })

  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: `${content}\n\n${EXTRACTION_PROMPT}`,
      },
    ],
  })

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new LLMExtractionError('Ollama response contained no content')
  }

  return parseAndValidate(raw)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Extract beer price list items from document content using the configured LLM provider.
 *
 * @param content - Plain text string, or `{ type: 'pdf_base64', data }` for native PDF (Anthropic only).
 * @returns Array of validated `ExtractedItem` objects.
 */
export async function extractPriceItems(content: ExtractionContent): Promise<ExtractedItem[]> {
  const provider = process.env.LLM_PROVIDER ?? 'ollama'

  switch (provider) {
    case 'anthropic':
      return extractWithAnthropic(content)
    case 'ollama':
      return extractWithOllama(content)
    default:
      throw new LLMExtractionError(
        `Unknown LLM_PROVIDER "${provider}". Supported values: "ollama", "anthropic".`,
      )
  }
}
