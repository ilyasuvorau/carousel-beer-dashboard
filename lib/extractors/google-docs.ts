import { google } from 'googleapis'

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!key) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set')
  const credentials = JSON.parse(key)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents.readonly'],
  })
}

/** Extract document ID from a Google Docs URL */
export function extractDocId(url: string): string {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) throw new Error('Invalid Google Docs URL')
  return match[1]
}

/** Fetch Google Doc content as plain text */
export async function fetchGoogleDoc(url: string): Promise<string> {
  const docId = extractDocId(url)
  const auth = getAuth()
  const docs = google.docs({ version: 'v1', auth })

  const { data } = await docs.documents.get({ documentId: docId })

  // Extract text from the document body
  const text: string[] = []
  for (const element of data.body?.content ?? []) {
    if (element.paragraph) {
      for (const pe of element.paragraph.elements ?? []) {
        if (pe.textRun?.content) {
          text.push(pe.textRun.content)
        }
      }
    }
  }
  return text.join('')
}
