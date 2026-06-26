import type { UiLang } from '@/api/directus'
import { getTranslatedField } from '@/utils/translation'

export type IntruduceField = 'tag' | 'lab_name' | 'lab_description' | 'lab_about'

export interface ExtraInfoItem {
  key?: string
  value?: string
}

export interface IntruduceTranslation {
  [key: string]: unknown
  languages_code?: string
  tag?: string
  lab_name?: string
  lab_description?: string
  lab_about?: string
  extra_info?: ExtraInfoItem[]
}

export interface Intruduce {
  [key: string]: unknown
  id?: number | string
  tag: string
  lab_name: string
  lab_description: string
  lab_about: string
  extra_info?: ExtraInfoItem[]
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

function mapExtraInfoItems(items: ExtraInfoItem[]) {
  return items
    .map((item) => ({
      label: String(item.key ?? ''),
      value: String(item.value ?? ''),
    }))
    .filter((item) => item.label || item.value)
}

function getExtraInfoTranslationArray(data: Intruduce, currentLang: UiLang) {
  const translations = Array.isArray(data.translations) ? data.translations : []
  const langPrefix = currentLang === 'en' ? 'en' : 'zh'
  const langMatched = translations.find((item) =>
    String(item?.languages_code || '').toLowerCase().startsWith(langPrefix),
  )
  const fallbackTranslation = translations.find((item) => Array.isArray(item?.extra_info))
  const source = langMatched?.extra_info ?? fallbackTranslation?.extra_info
  return Array.isArray(source) ? (source as ExtraInfoItem[]) : []
}

/** extra_info 列表：key 为 label，value 为展示值，英文按 translations 下标对齐 */
export function getTranslatedExtraInfo(
  data: Intruduce | null | undefined,
  currentLang: UiLang,
): Array<{ label: string; value: string }> {
  if (!data) return []

  const baseItems = (Array.isArray(data.extra_info) ? data.extra_info : []) as ExtraInfoItem[]
  if (!baseItems.length) return []

  if (currentLang === 'zh') {
    return mapExtraInfoItems(baseItems)
  }

  const translatedItems = getExtraInfoTranslationArray(data, currentLang)

  return baseItems
    .map((item, index) => {
      const tr = translatedItems[index]
      return {
        label: String(tr?.key ?? item.key ?? ''),
        value: String(tr?.value ?? item.value ?? ''),
      }
    })
    .filter((item) => item.label || item.value)
}
