import type { UiLang } from '@/api/directus'
import { getTranslatedField } from '@/utils/translation'

export type IntruduceField = 'tag' | 'lab_name' | 'lab_description' | 'lab_about'

export interface IntruduceTranslation {
  [key: string]: unknown
  languages_code?: string
  tag?: string
  lab_name?: string
  lab_description?: string
  lab_about?: string
}

export interface Intruduce {
  [key: string]: unknown
  id?: number | string
  tag: string
  lab_name: string
  lab_description: string
  lab_about: string
  introData?: Array<{
    founded?: string
    members?: string
    research_areas?: string
    top_papers?: string
  }>
  background_img?: string | { id?: string }
  translations?: IntruduceTranslation[]
}

export function getTranslatedIntruduceField(
  data: Intruduce | null | undefined,
  field: IntruduceField,
  currentLang: UiLang,
): string {
  return getTranslatedField(data, field, currentLang)
}
