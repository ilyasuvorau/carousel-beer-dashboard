declare module 'pdf-parse' {
  export interface TextResult {
    text: string
    pages: Array<{ num: number; text: string }>
    total: number
    getPageText(num: number): string
  }

  export interface LoadParameters {
    data: Buffer | Uint8Array
    verbosity?: number
  }

  export interface ParseParameters {
    parseHyperlinks?: boolean
    parsePageInfo?: boolean
  }

  export class PDFParse {
    constructor(options: LoadParameters)
    getText(params?: ParseParameters): Promise<TextResult>
    load(): Promise<unknown>
    destroy(): Promise<void>
  }
}
