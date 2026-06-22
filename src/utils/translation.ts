import type { UiLang } from '@/api/directus'

type TranslatableRecord = {
  translations?: Array<{ languages_code?: string; [key: string]: unknown }>
  [key: string]: unknown
}

export function getTranslatedField(
  data: TranslatableRecord | null | undefined,
  field: string,
  currentLang: UiLang,
): string {
  if (!data || !field) return ''

  const baseValue = String(data[field] ?? '')
  const translations = Array.isArray(data.translations) ? data.translations : []
  const langPrefix = currentLang === 'en' ? 'en' : 'zh'
  const langMatched = translations.find((item) =>
    String(item?.languages_code || '').toLowerCase().startsWith(langPrefix),
  )
  const fallbackTranslation = translations.find((item) => item?.[field] !== undefined)
  const translatedValue = String(
    (langMatched?.[field] as string | undefined) ??
      (fallbackTranslation?.[field] as string | undefined) ??
      '',
  )

  if (currentLang === 'zh') {
    return baseValue || translatedValue
  }

  return translatedValue || baseValue
}

function formatExperienceValue(source: unknown): string {
  if (source === null || source === undefined || source === '') return ''
  if (Array.isArray(source)) {
    return source
      .map((item) =>
        typeof item === 'object' && item !== null
          ? String((item as { value?: unknown }).value ?? '')
          : String(item),
      )
      .filter(Boolean)
      .join('\n')
  }
  return String(source)
}

function hasExperienceValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  return true
}

/** experience 可能是 repeater 数组，翻译解析逻辑与 getTranslatedField 一致 */
export function getTranslatedExperienceField(
  data: TranslatableRecord | null | undefined,
  currentLang: UiLang,
): string {
  if (!data) return ''

  const baseValue = data.experience
  const translations = Array.isArray(data.translations) ? data.translations : []
  const langPrefix = currentLang === 'en' ? 'en' : 'zh'
  const langMatched = translations.find((item) =>
    String(item?.languages_code || '').toLowerCase().startsWith(langPrefix),
  )
  const fallbackTranslation = translations.find((item) => hasExperienceValue(item?.experience))
  const translatedSource = langMatched?.experience ?? fallbackTranslation?.experience

  if (currentLang === 'zh') {
    return formatExperienceValue(hasExperienceValue(baseValue) ? baseValue : translatedSource)
  }

  return formatExperienceValue(hasExperienceValue(translatedSource) ? translatedSource : baseValue)
}
