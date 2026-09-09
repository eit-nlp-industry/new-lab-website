import { directusPublicAssetUrl } from '@/api/directus'

export interface PaperAuthor {
  value: string
}

export interface PaperButton {
  name: string
  link: string
  icon?: string
}

export interface Paper {
  id: number | string
  title: string
  authors?: PaperAuthor[]
  publisher?: string
  date?: string
  year?: number | null
  status: string
  buttons?: PaperButton[]
  paperImg?: string | { id: string }
}

export function formatAuthors(authors?: PaperAuthor[] | null) {
  if (!Array.isArray(authors) || authors.length === 0) return ''
  return authors
    .map((a) => (a && typeof a === 'object' ? String(a.value ?? '') : ''))
    .filter(Boolean)
    .join(', ')
}

export function getPaperImage(paper: Paper) {
  return paper?.paperImg ? directusPublicAssetUrl(paper.paperImg) : ''
}

/** 规范化年份；缺省时尽量从 date 推断，否则归入 0 便于排序兜底 */
export function resolvePaperYear(paper: Pick<Paper, 'year' | 'date'>): number {
  const yearNum = Number(paper?.year)
  if (Number.isFinite(yearNum) && yearNum > 0) return yearNum
  const dateYear = Number(String(paper?.date || '').slice(0, 4))
  if (Number.isFinite(dateYear) && dateYear > 0) return dateYear
  return 0
}
