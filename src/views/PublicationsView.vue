<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@/composables/useLocale'
import {
  directusPublicAssetUrl,
  fetchPapers,
  fetchPatents,
  fetchPdfTable,
  type PatentRecord,
  type PdfTableRecord,
} from '@/api/directus'
import { formatAuthors, getPaperImage, resolvePaperYear, type Paper } from '@/utils/paper'
import { getTranslatedField } from '@/utils/translation'

const { t, locale } = useLocale()
const papers = ref<Paper[]>([])
const patentRecords = ref<PatentRecord[]>([])
const pdfTableRecords = ref<PdfTableRecord[]>([])

const publishedPapers = computed(() => papers.value.filter((p) => p.status === 'published'))

const patents = computed(() =>
  patentRecords.value
    .map((patent) => ({
      id: patent.id,
      title: getTranslatedField(patent, 'title', locale.value),
      image: patent.image ? directusPublicAssetUrl(patent.image) : '',
    }))
    .filter((patent) => patent.title),
)

const researchGuideRows = computed(() =>
  pdfTableRecords.value
    .map((row) => {
      const sortNum = Number(row.sort)
      return {
        id: row.id,
        stepLabel: getTranslatedField(row, 'step_label', locale.value),
        title: getTranslatedField(row, 'title', locale.value),
        description: getTranslatedField(row, 'description', locale.value),
        pdfUrl: row.pdf ? directusPublicAssetUrl(row.pdf) : '',
        sort: Number.isFinite(sortNum) ? sortNum : Number.MAX_SAFE_INTEGER,
      }
    })
    .filter((row) => row.stepLabel || row.title || row.description)
    .sort((a, b) => a.sort - b.sort || Number(a.id) - Number(b.id)),
)

const totalCount = computed(() => publishedPapers.value.length)

const publicationsByYear = computed(() => {
  const grouped = new Map<number, Paper[]>()
  for (const pub of publishedPapers.value) {
    const year = resolvePaperYear(pub)
    const list = grouped.get(year) ?? []
    list.push(pub)
    grouped.set(year, list)
  }
  return [...grouped.entries()].sort(([yearA], [yearB]) => yearB - yearA)
})

const sectionAnchors = computed(() => {
  const anchors = [
    {
      id: 'publications',
      label: t({ zh: '论文', en: 'Publications' }),
      count: totalCount.value,
      unit: t({ zh: '篇', en: '' }),
    },
    {
      id: 'patents',
      label: t({ zh: '专利', en: 'Patents' }),
      count: patents.value.length,
      unit: t({ zh: '项', en: '' }),
    },
  ]
  // if (patents.value.length) {
  //   anchors.push({
  //     id: 'patents',
  //     label: t({ zh: '专利', en: 'Patents' }),
  //     count: patents.value.length,
  //     unit: t({ zh: '项', en: '' }),
  //   })
  // }
  return anchors
})

type PatentPreview = {
  title: string
  image: string
}

const previewPatent = ref<PatentPreview | null>(null)

function openPatentPreview(patent: { title: string; image: string }) {
  if (!patent.image) return
  previewPatent.value = { title: patent.title, image: patent.image }
}

function closePatentPreview() {
  previewPatent.value = null
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onPreviewKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closePatentPreview()
}

watch(previewPatent, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onPreviewKeydown)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onPreviewKeydown)
  }
})

onMounted(async () => {
  const [papersResult, patentsResult, pdfTableResult] = await Promise.allSettled([
    fetchPapers(),
    fetchPatents(),
    fetchPdfTable(),
  ])

  if (papersResult.status === 'fulfilled') {
    papers.value = papersResult.value?.data ?? []
  } else {
    console.error('[PublicationsView] fetchPapers failed:', papersResult.reason)
  }

  if (patentsResult.status === 'fulfilled') {
    patentRecords.value = patentsResult.value?.data ?? []
  } else {
    console.error('[PublicationsView] fetchPatents failed:', patentsResult.reason)
  }

  if (pdfTableResult.status === 'fulfilled') {
    pdfTableRecords.value = pdfTableResult.value?.data ?? []
  } else {
    console.error('[PublicationsView] fetchPdfTable failed:', pdfTableResult.reason)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onPreviewKeydown)
})
</script>

<template>
  <div class="space-y-16 text-base sm:space-y-20 sm:text-lg">
    <header class="border-b border-slate-200/80 pb-8 sm:pb-10">
      <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
        {{ t({ zh: '研究成果', en: 'Research' }) }}
      </span>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ t({ zh: '论文与专利', en: 'Publications & Patents' }) }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
        {{
          t({
            zh: '实验室论文成果与发明专利一览，可通过下方导航快速定位到对应模块。',
            en: 'Browse our publications and invention patents. Use the navigation below to jump to each section.',
          })
        }}
      </p>

      <nav
        v-if="sectionAnchors.length"
        class="mt-6 flex flex-wrap gap-3"
        :aria-label="t({ zh: '成果导航', en: 'Section navigation' })"
      >
        <button
          v-for="anchor in sectionAnchors"
          :key="anchor.id"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800 sm:px-5 sm:py-2.5 sm:text-base"
          @click="scrollToSection(anchor.id)"
        >
          {{ anchor.label }}
          <span class="font-mono text-xs text-slate-400 sm:text-sm">
            {{ anchor.count }}{{ anchor.unit }}
          </span>
        </button>
      </nav>
    </header>

    <section
      v-if="researchGuideRows.length"
      id="research-guide"
      class="scroll-mt-24"
      aria-labelledby="research-guide-heading"
    >
      <div class="flex items-center gap-4">
        <div>
          <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
            {{ t({ zh: '入门指引', en: 'Getting Started' }) }}
          </span>
          <h2
            id="research-guide-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {{ t({ zh: '研究指南', en: 'Research Guide' }) }}
          </h2>
        </div>
        <div class="h-px flex-1 bg-gradient-to-r from-cyan-300/80 to-transparent" aria-hidden="true" />
        <span
          class="shrink-0 rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800 sm:text-base"
        >
          {{ researchGuideRows.length }}{{ t({ zh: ' 篇', en: ' guides' }) }}
        </span>
      </div>

      <div class="mt-6 overflow-x-auto">
        <table class="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr class="border-b border-slate-200">
              <th scope="col" class="w-[28%] py-3 pr-4 text-sm font-medium text-slate-500 sm:text-base">
                <span class="sr-only">{{ t({ zh: '步骤', en: 'Step' }) }}</span>
              </th>
              <th scope="col" class="py-3 pr-4 text-sm font-medium text-slate-500 sm:text-base">
                {{ t({ zh: '内容', en: 'Content' }) }}
              </th>
              <th
                scope="col"
                class="w-28 py-3 text-right text-sm font-medium text-slate-500 sm:w-36 sm:text-base"
              >
                PDF
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in researchGuideRows"
              :key="row.id"
              class="border-b border-slate-200 align-top last:border-b-0"
            >
              <td class="py-5 pr-4 text-sm font-medium text-slate-800 sm:py-6 sm:text-base">
                {{ row.stepLabel }}
              </td>
              <td class="py-5 pr-4 sm:py-6">
                <p v-if="row.title" class="text-base font-semibold text-slate-900 sm:text-lg">
                  {{ row.title }}
                </p>
                <p
                  v-if="row.description"
                  class="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base"
                >
                  {{ row.description }}
                </p>
              </td>
              <td class="py-5 text-right sm:py-6">
                <a
                  v-if="row.pdfUrl"
                  :href="row.pdfUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition-colors hover:text-cyan-900 sm:text-base"
                >
                  {{ t({ zh: '阅读 PDF', en: 'Read PDF' }) }}
                  <span aria-hidden="true">→</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section
      id="publications"
      class="scroll-mt-24"
      aria-labelledby="publications-heading"
    >
      <div class="flex items-center gap-4">
        <div>
          <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
            {{ t({ zh: '学术成果', en: 'Academic Output' }) }}
          </span>
          <h2
            id="publications-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {{ t({ zh: '主要论文', en: 'Main Publications' }) }}
          </h2>
        </div>
        <div class="h-px flex-1 bg-gradient-to-r from-cyan-300/80 to-transparent" aria-hidden="true" />
        <span
          class="shrink-0 rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800 sm:text-base"
        >
          {{ totalCount }}{{ t({ zh: ' 篇', en: ' papers' }) }}
        </span>
      </div>

      <p class="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
        {{
          t({
            zh: '按年份倒序排列的完整论文列表，可通过下方按钮访问论文相关链接。',
            en: 'Full publication list in reverse chronological order. Use the buttons below to open related links.',
          })
        }}
      </p>

    <div class="mt-10 space-y-14 sm:space-y-16">
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
                    {{ String(resolvePaperYear(pub) || '').slice(-2) }}
                  </span>
                  <span class="mt-0.5 font-mono text-xs text-slate-400">{{ resolvePaperYear(pub) || '—' }}</span>
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
    </section>

    <section
      v-if="patents.length"
      id="patents"
      class="scroll-mt-24 border-t border-slate-200/80 pt-14 sm:pt-16"
      aria-labelledby="patents-heading"
    >
      <div class="flex items-center gap-4">
        <div>
          <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
            {{ t({ zh: '知识产权', en: 'Intellectual Property' }) }}
          </span>
          <h2
            id="patents-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {{ t({ zh: '发明专利', en: 'Patents' }) }}
          </h2>
        </div>
        <div class="h-px flex-1 bg-gradient-to-r from-cyan-300/80 to-transparent" aria-hidden="true" />
        <span
          class="shrink-0 rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800 sm:text-base"
        >
          {{ patents.length }}{{ t({ zh: ' 项', en: ' patents' }) }}
        </span>
      </div>

      <p class="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
        {{
          t({
            zh: '实验室已授权的发明专利证书展示。',
            en: 'Granted invention patents from our laboratory.',
          })
        }}
      </p>

      <ul class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        <li v-for="patent in patents" :key="patent.id" class="group">
          <article
            class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-cyan-200/80 hover:shadow-lg"
          >
            <h3
              class="line-clamp-2 px-4 pt-4 text-sm font-semibold leading-snug text-slate-900 sm:px-5 sm:pt-5 sm:text-base"
            >
              {{ patent.title }}
            </h3>
            <div class="relative mt-3 flex-1 px-4 pb-4 sm:mt-4 sm:px-5 sm:pb-5">
              <div
                class="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shadow-inner"
              >
                <div class="aspect-[3/4] w-full">
                  <button
                    v-if="patent.image"
                    type="button"
                    class="group/img relative block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
                    :aria-label="t({ zh: '放大查看专利证书', en: 'View patent certificate' })"
                    @click="openPatentPreview(patent)"
                  >
                    <img
                      :src="patent.image"
                      :alt="patent.title"
                      class="h-full w-full object-contain transition-transform duration-500 group-hover/img:scale-[1.02]"
                      loading="lazy"
                    />
                  </button>
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-sm text-slate-400"
                  >
                    {{ t({ zh: '暂无图片', en: 'No image' }) }}
                  </div>
                </div>
                <span
                  class="absolute right-0 bottom-0 left-0 h-0.5 origin-right scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </div>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <Teleport to="body">
      <div
        v-if="previewPatent"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        :aria-label="previewPatent.title"
        @click.self="closePatentPreview"
      >
        <div class="absolute inset-0 bg-slate-900/85 backdrop-blur-sm" aria-hidden="true" />

        <div class="relative z-10 flex max-h-full w-full max-w-4xl flex-col items-center">
          <button
            type="button"
            class="absolute -top-2 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:-top-4 sm:-right-4"
            :aria-label="t({ zh: '关闭预览', en: 'Close preview' })"
            @click="closePatentPreview"
          >
            <span class="text-2xl leading-none" aria-hidden="true">&times;</span>
          </button>

          <img
            :src="previewPatent.image"
            :alt="previewPatent.title"
            class="max-h-[78vh] w-auto max-w-full rounded-lg bg-white object-contain shadow-2xl"
          />

          <p class="mt-4 max-w-3xl text-center text-sm leading-relaxed text-white/90 sm:text-base">
            {{ previewPatent.title }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
