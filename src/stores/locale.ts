import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Locale, LocalizedText } from '@/types'

const STORAGE_KEY = 'lab-locale'

export const useLocaleStore = defineStore('locale', () => {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  const locale = ref<Locale>(saved === 'en' || saved === 'zh' ? saved : 'zh')

  function setLocale(lang: Locale) {
    locale.value = lang
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }

  function t(text: LocalizedText): string {
    return text[locale.value]
  }

  setLocale(locale.value)

  return { locale, setLocale, t }
})
