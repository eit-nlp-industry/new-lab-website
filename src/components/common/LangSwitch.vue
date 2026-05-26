<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import type { Locale } from '@/types'

const { locale, setLocale } = useLocale()

function switchTo(lang: Locale) {
  setLocale(lang)
}
</script>

<template>
  <div class="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm font-medium">
    <button
      type="button"
      class="rounded-md px-2.5 py-1 transition-all duration-200"
      :class="locale === 'zh' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-cyan-900'"
      @click="switchTo('zh')"
    >
      CN
    </button>
    <button
      type="button"
      class="rounded-md px-2.5 py-1 transition-all duration-200"
      :class="locale === 'en' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-cyan-900'"
      @click="switchTo('en')"
    >
      EN
    </button>
  </div>
</template>
