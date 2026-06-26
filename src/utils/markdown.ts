import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function renderMarkdown(source: string): string {
  const text = String(source ?? '').trim()
  if (!text) return ''
  return marked.parse(text, { async: false }) as string
}
