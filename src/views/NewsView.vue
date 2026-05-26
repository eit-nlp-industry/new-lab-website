<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import { useLab } from '@/composables/useLab'

const { t } = useLocale()
const lab = useLab()
</script>

<template>
  <div class="space-y-16 text-base sm:space-y-20 sm:text-lg">
    <header class="border-b border-slate-200/80 pb-8 sm:pb-10">
      <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
        {{ t({ zh: '动态', en: 'Updates' }) }}
      </span>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ t({ zh: '新闻动态', en: 'Lab News' }) }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
        {{
          t({
            zh: '了解实验室最新活动、论文成果与合作进展。',
            en: 'Latest events, publications, and collaborations from our lab.',
          })
        }}
      </p>
      <p class="mt-4 font-mono text-sm text-slate-400 sm:text-base">
        {{ lab.sortedNews.length }}
        {{ t({ zh: ' 条动态', en: ' articles' }) }}
      </p>
    </header>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
      <RouterLink
        v-for="(item, index) in lab.sortedNews"
        :key="item.id"
        :to="`/news/${item.id}`"
        class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-200/60 hover:shadow-lg"
        :class="index === 0 ? 'sm:col-span-2 lg:grid lg:grid-cols-2' : ''"
      >
        <div
          class="relative overflow-hidden"
          :class="index === 0 ? 'aspect-[21/9] lg:aspect-auto lg:min-h-full' : 'aspect-[16/10]'"
        >
          <img
            :src="item.image"
            :alt="t(item.title)"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"
            aria-hidden="true"
          />
          <time
            class="absolute top-4 left-4 rounded-md bg-white/90 px-3 py-1.5 font-mono text-xs font-medium text-slate-700 backdrop-blur-sm sm:text-sm"
          >
            {{ item.date }}
          </time>
          <span
            v-if="index === 0"
            class="absolute top-4 right-4 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-100 backdrop-blur-sm sm:text-sm"
          >
            {{ t({ zh: '最新', en: 'Latest' }) }}
          </span>
        </div>
        <div
          class="flex flex-1 flex-col p-6 sm:p-8"
          :class="index === 0 ? 'lg:justify-center' : ''"
        >
          <h2
            class="line-clamp-2 font-semibold leading-snug text-slate-900 transition-colors group-hover:text-cyan-800"
            :class="index === 0 ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'"
          >
            {{ t(item.title) }}
          </h2>
          <p
            class="mt-3 line-clamp-3 flex-1 leading-relaxed text-slate-500"
            :class="index === 0 ? 'text-base sm:text-lg' : 'text-sm sm:text-base'"
          >
            {{ t(item.summary) }}
          </p>
          <span
            class="mt-5 inline-flex items-center gap-1 text-base font-medium text-cyan-700"
          >
            {{ t({ zh: '阅读全文', en: 'Read more' }) }}
            <span
              class="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
