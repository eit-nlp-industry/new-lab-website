import { directusAssetUrl } from '@/api/directus'

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
  year: number
  status: string
  buttons?: PaperButton[]
  paperImg?: string | { id: string }
}

export function formatAuthors(authors: PaperAuthor[] = []) {
  return authors.map((a) => a.value).filter(Boolean).join(', ')
}

export function getPaperImage(paper: Paper) {
  return paper?.paperImg ? directusAssetUrl(paper.paperImg) : ''
}
