<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { fetchPapers } from '@/api/directus'
import { formatAuthors, getPaperImage, type Paper } from '@/utils/paper'

const { t } = useLocale()
const papers = ref<Paper[]>([])

const publishedPapers = computed(() => papers.value.filter((p) => p.status === 'published'))

const totalCount = computed(() => publishedPapers.value.length)

const publicationsByYear = computed(() => {
  const grouped = new Map<number, Paper[]>()
  for (const pub of publishedPapers.value) {
    const list = grouped.get(pub.year) ?? []
    list.push(pub)
    grouped.set(pub.year, list)
  }
  return [...grouped.entries()].sort(([yearA], [yearB]) => yearB - yearA)
})

onMounted(async () => {
  try {
    const res = await fetchPapers()
    papers.value = res?.data ?? []
  } catch (e) {
    console.error('[PublicationsView] fetchPapers failed:', e)
  }
})
</script>

<template>
  <div class="space-y-16 text-base sm:space-y-20 sm:text-lg">
    <header class="border-b border-slate-200/80 pb-8 sm:pb-10">
      <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
        {{ t({ zh: '研究成果', en: 'Research' }) }}
      </span>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ t({ zh: '发表论文', en: 'Publications' }) }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
        {{
          t({
            zh: '按年份倒序排列的完整论文列表，可通过下方按钮访问论文相关链接。',
            en: 'Full publication list in reverse chronological order. Use the buttons below to open related links.',
          })
        }}
      </p>
      <p class="mt-4 font-mono text-sm text-slate-400 sm:text-base">
        {{ totalCount }}
        {{ t({ zh: ' 篇论文', en: ' papers' }) }}
      </p>
    </header>

    <div class="space-y-14 sm:space-y-16">
      <section
        v-for="[year, pubs] in publicationsByYear"
        :key="year"
        class="scroll-mt-24"
        :aria-labelledby="`year-${year}`"
      >
        <div class="flex items-center gap-4">
          <h2
            :id="`year-${year}`"
            class="font-mono text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          >
            {{ year }}
          </h2>
          <div class="h-px flex-1 bg-gradient-to-r from-cyan-300/80 to-transparent" aria-hidden="true" />
          <span
            class="shrink-0 rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800 sm:text-base"
          >
            {{ pubs.length }}{{ t({ zh: ' 篇', en: ' papers' }) }}
          </span>
        </div>

        <ul class="mt-8 space-y-4">
          <li v-for="pub in pubs" :key="pub.id" class="group">
            <div
              class="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-cyan-200/80 hover:shadow-lg sm:gap-6 sm:p-6"
            >
              <div class="min-w-0 flex-1">
                <p
                  v-if="pub.publisher || pub.date"
                  class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600 sm:text-sm"
                >
                  <span v-if="pub.publisher">{{ pub.publisher }}</span>
                  <span v-if="pub.publisher && pub.date" class="text-slate-400">·</span>
                  <span v-if="pub.date">{{ pub.date }}</span>
                </p>
                <h3 class="mt-3 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                  {{ pub.title }}
                </h3>
                <p v-if="formatAuthors(pub.authors)" class="mt-2 text-sm text-slate-500 sm:text-base">
                  {{ formatAuthors(pub.authors) }}
                </p>
                <div v-if="pub.buttons?.length" class="mt-4 flex flex-wrap gap-2">
                  <a
                    v-for="(btn, idx) in pub.buttons"
                    :key="`${pub.id}-${idx}`"
                    :href="btn.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-800 transition-colors hover:border-cyan-300 hover:bg-cyan-100"
                  >
                    {{ btn.name }}
                  </a>
                </div>
              </div>

              <div
                class="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40"
              >
                <img
                  v-if="getPaperImage(pub)"
                  :src="getPaperImage(pub)"
                  :alt="pub.title"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950"
                >
                  <span class="font-mono text-xl font-bold text-cyan-300/90 sm:text-2xl">
                    {{ String(pub.year).slice(2) }}
                  </span>
                  <span class="mt-0.5 font-mono text-xs text-slate-400">{{ pub.year }}</span>
                </div>
                <span
                  class="absolute right-0 bottom-0 left-0 h-0.5 origin-right scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
