<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { directusPublicAssetUrl, fetchIntruduce, fetchNews, fetchPapers, type NewsRecord } from '@/api/directus'
import { useLocale } from '@/composables/useLocale'
import { getTranslatedIntruduceField, type Intruduce } from '@/utils/intruduce'
import { formatAuthors, getPaperImage, type Paper } from '@/utils/paper'
import { getTranslatedField } from '@/utils/translation'

const { t, locale } = useLocale()
const latestPapers = ref<Paper[]>([])
const intruduceRawData = ref<Intruduce | null>(null)
const newsList = ref<NewsRecord[]>([])

const featuredPaper = computed(() => latestPapers.value[0])
const otherPapers = computed(() => latestPapers.value.slice(1))

const heroTagline = computed(() =>
  getTranslatedIntruduceField(intruduceRawData.value, 'tag', locale.value),
)
const heroTitle = computed(() =>
  getTranslatedIntruduceField(intruduceRawData.value, 'lab_name', locale.value),
)
const heroVision = computed(() =>
  getTranslatedIntruduceField(intruduceRawData.value, 'lab_description', locale.value),
)
const introBody = computed(() =>
  getTranslatedIntruduceField(intruduceRawData.value, 'lab_about', locale.value),
)
const latestNews = computed(() =>
  [...newsList.value]
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 3),
)

function getNewsField(item: NewsRecord, field: 'title' | 'description' | 'date') {
  return getTranslatedField(item, field, locale.value)
}

function getNewsCover(item: NewsRecord) {
  if (item.image) {
    return directusPublicAssetUrl(String(item.image))
  }
  const firstImage = item.imgList?.[0]
  return firstImage ? directusPublicAssetUrl(String(firstImage)) : ''
}

const introStats = computed(() => {
  const introData = intruduceRawData.value?.introData?.[0]
  return [
    {
      value: introData?.founded || '2018',
      label: { zh: '成立年份', en: 'Founded' },
    },
    {
      value: introData?.top_papers || '30+',
      label: { zh: '顶会论文', en: 'Top Papers' },
    },
    {
      value: introData?.members || '21',
      label: { zh: '团队成员', en: 'Members' },
    },
    {
      value: introData?.research_areas || '4',
      label: { zh: '研究方向', en: 'Research Areas' },
    },
  ]
})

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop&q=80'

const intruduceLoaded = ref(false)

const heroImage = computed(() => {
  if (!intruduceLoaded.value) return ''
  const bg = intruduceRawData.value?.background_img
  if (bg) {
    return directusPublicAssetUrl(bg)
  }
  return DEFAULT_HERO_IMAGE
})

onMounted(async () => {
  const [papersResult, intruduceResult, newsResult] = await Promise.allSettled([
    fetchPapers({ limit: 5 }),
    fetchIntruduce(),
    fetchNews(),
  ])

  if (papersResult.status === 'fulfilled') {
    latestPapers.value = (papersResult.value?.data ?? []).filter(
      (p: Paper) => p.status === 'published',
    )
  } else {
    console.error('[HomeView] fetchPapers failed:', papersResult.reason)
  }

  if (intruduceResult.status === 'fulfilled') {
    intruduceRawData.value = intruduceResult.value?.data ?? null
  } else {
    console.error('[HomeView] fetchIntruduce failed:', intruduceResult.reason)
  }
  intruduceLoaded.value = true

  if (newsResult.status === 'fulfilled') {
    newsList.value = newsResult.value?.data ?? []
  } else {
    console.error('[HomeView] fetchNews failed:', newsResult.reason)
  }
})
</script>

<template>
  <div class="-mx-6 -mt-8 space-y-20 text-base sm:-mx-10 sm:space-y-24 lg:-mx-16">
    <!-- Hero -->
    <section
      class="relative flex min-h-[min(88svh,720px)] items-end overflow-hidden bg-slate-900 sm:min-h-[min(78svh,680px)]"
    >
      <img
        v-if="heroImage"
        :src="heroImage"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        fetchpriority="high"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative w-full px-4 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium tracking-widest text-cyan-300 uppercase backdrop-blur-sm"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
          {{ heroTagline }}
        </p>
        <h1
          class="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.08]"
        >
          {{ heroTitle }}
        </h1>
        <p
          class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl sm:leading-relaxed"
        >
          {{ heroVision }}
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <RouterLink
            to="/publications"
            class="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            {{ t({ zh: '浏览论文', en: 'Publications' }) }}
          </RouterLink>
          <RouterLink
            to="/team"
            class="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {{ t({ zh: '认识团队', en: 'Meet the Team' }) }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Intro -->
    <section class="px-4 sm:px-0">
      <div
        class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-7 sm:p-10 lg:p-12"
      >
        <div
          class="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-cyan-500/5 to-transparent"
          aria-hidden="true"
        />
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14">
          <div class="shrink-0 lg:w-56">
            <span
              class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase"
            >
              {{ t({ zh: '关于我们', en: 'About' }) }}
            </span>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {{ t({ zh: '实验室简介', en: 'About the Lab' }) }}
            </h2>
          </div>
          <p class="flex-1 text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
            {{ introBody }}
          </p>
        </div>
        <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            v-for="stat in introStats"
            :key="stat.label.zh"
            class="rounded-xl border border-slate-100 bg-white px-5 py-4 text-center shadow-sm"
          >
            <p class="font-mono text-2xl font-bold text-slate-900 sm:text-3xl">{{ stat.value }}</p>
            <p class="mt-1 text-sm text-slate-500 sm:text-base">{{ t(stat.label) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section class="px-4 sm:px-0">
      <div
        class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-cyan-50/30 p-6 sm:p-8 lg:p-10"
      >
        <div
          class="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
              {{ t({ zh: '研究成果', en: 'Research' }) }}
            </span>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {{ t({ zh: '最新论文', en: 'Latest Publications' }) }}
            </h2>
          </div>
          <RouterLink
            to="/publications"
            class="inline-flex items-center gap-1 text-base font-medium text-cyan-700 transition-colors hover:text-cyan-900"
          >
            {{ t({ zh: '查看全部', en: 'View all' }) }}
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <div v-if="featuredPaper" class="relative mt-8 space-y-5">
          <!-- Featured latest paper -->
          <article
            class="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-cyan-200/80 hover:shadow-lg"
          >
            <div class="flex flex-col md:flex-row">
              <div
                class="relative aspect-[16/10] shrink-0 overflow-hidden md:w-[42%] lg:w-[38%]"
              >
                <img
                  v-if="getPaperImage(featuredPaper)"
                  :src="getPaperImage(featuredPaper)"
                  :alt="featuredPaper.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div
                  v-else
                  class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950"
                >
                  <span class="font-mono text-4xl font-bold text-cyan-300/90 sm:text-5xl">
                    {{ String(featuredPaper.year).slice(2) }}
                  </span>
                  <span class="mt-1 font-mono text-sm text-slate-400">{{ featuredPaper.year }}</span>
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900/5"
                  aria-hidden="true"
                />
                <span
                  class="absolute top-4 left-4 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white shadow-sm sm:text-sm"
                >
                  {{ t({ zh: '最新', en: 'New' }) }}
                </span>
              </div>

              <div class="flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-8">
                <p
                  v-if="featuredPaper.publisher || featuredPaper.date"
                  class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-medium text-slate-500 sm:text-sm"
                >
                  <span v-if="featuredPaper.publisher" class="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                    {{ featuredPaper.publisher }}
                  </span>
                  <span v-if="featuredPaper.date">{{ featuredPaper.date }}</span>
                </p>
                <h3 class="mt-4 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                  {{ featuredPaper.title }}
                </h3>
                <p
                  v-if="formatAuthors(featuredPaper.authors)"
                  class="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:text-base"
                >
                  {{ formatAuthors(featuredPaper.authors) }}
                </p>
                <div v-if="featuredPaper.buttons?.length" class="mt-5 flex flex-wrap gap-2">
                  <a
                    v-for="(btn, idx) in featuredPaper.buttons"
                    :key="`featured-${idx}`"
                    :href="btn.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center rounded-lg border border-cyan-200 bg-cyan-50 px-3.5 py-2 text-sm font-medium text-cyan-800 transition-colors hover:border-cyan-300 hover:bg-cyan-100"
                  >
                    {{ btn.name }}
                  </a>
                </div>
              </div>
            </div>
          </article>

          <!-- Remaining papers -->
          <ul v-if="otherPapers.length" class="grid gap-4 sm:grid-cols-2">
            <li v-for="pub in otherPapers" :key="pub.id" class="group">
              <div
                class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200/80 hover:shadow-md sm:flex-row"
              >
                <div
                  class="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-36 md:w-44 lg:w-48"
                >
                  <img
                    v-if="getPaperImage(pub)"
                    :src="getPaperImage(pub)"
                    :alt="pub.title"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:absolute sm:inset-0"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex h-full min-h-[5.5rem] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 sm:absolute sm:inset-0"
                  >
                    <span class="font-mono text-2xl font-bold text-cyan-300/90">
                      {{ String(pub.year).slice(2) }}
                    </span>
                    <span class="mt-0.5 font-mono text-xs text-slate-400">{{ pub.year }}</span>
                  </div>
                </div>

                <div class="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  <p
                    v-if="pub.publisher || pub.date"
                    class="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs text-slate-500"
                  >
                    <span v-if="pub.publisher">{{ pub.publisher }}</span>
                    <span v-if="pub.publisher && pub.date" class="text-slate-300">·</span>
                    <span v-if="pub.date">{{ pub.date }}</span>
                  </p>
                  <h3 class="mt-2 line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                    {{ pub.title }}
                  </h3>
                  <p
                    v-if="formatAuthors(pub.authors)"
                    class="mt-2 line-clamp-1 text-sm text-slate-500"
                  >
                    {{ formatAuthors(pub.authors) }}
                  </p>
                  <div v-if="pub.buttons?.length" class="mt-auto flex flex-wrap gap-1.5 pt-3">
                    <a
                      v-for="(btn, idx) in pub.buttons"
                      :key="`${pub.id}-${idx}`"
                      :href="btn.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
                    >
                      {{ btn.name }}
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- News -->
    <section class="px-4 sm:px-0">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
            {{ t({ zh: '动态', en: 'Updates' }) }}
          </span>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {{ t({ zh: '实验室动态', en: 'Lab News' }) }}
          </h2>
        </div>
        <RouterLink
          to="/news"
          class="inline-flex items-center gap-1 text-base font-medium text-cyan-700 transition-colors hover:text-cyan-900"
        >
          {{ t({ zh: '查看全部', en: 'View all' }) }}
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>

      <!-- Mobile: horizontal scroll -->
      <div
        class="mt-10 -mx-4 flex gap-5 overflow-x-auto px-4 pb-3 snap-x snap-mandatory scroll-smooth sm:mx-0 sm:hidden"
      >
        <RouterLink
          v-for="item in latestNews"
          :key="item.id"
          :to="`/news/${item.id}`"
          class="group w-[min(88vw,340px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-lg"
        >
          <div class="relative aspect-[16/10] overflow-hidden">
            <img
              v-if="getNewsCover(item)"
              :src="getNewsCover(item)"
              :alt="getNewsField(item, 'title')"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"
              aria-hidden="true"
            />
            <time
              class="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 backdrop-blur-sm sm:text-sm"
            >
              {{ getNewsField(item, 'date') }}
            </time>
          </div>
          <div class="p-5">
            <h3
              class="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-cyan-800 sm:text-lg"
            >
              {{ getNewsField(item, 'title') }}
            </h3>
            <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:text-base">
              {{ getNewsField(item, 'description') }}
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Desktop: card grid -->
      <div class="mt-10 hidden gap-7 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="item in latestNews"
          :key="item.id"
          :to="`/news/${item.id}`"
          class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200/60 hover:shadow-lg"
        >
          <div class="relative aspect-[16/10] overflow-hidden">
            <img
              v-if="getNewsCover(item)"
              :src="getNewsCover(item)"
              :alt="getNewsField(item, 'title')"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>
          <div class="flex flex-1 flex-col p-6">
            <time class="font-mono text-sm text-slate-400">{{ getNewsField(item, 'date') }}</time>
            <h3
              class="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-cyan-800 sm:text-xl"
            >
              {{ getNewsField(item, 'title') }}
            </h3>
            <p class="mt-3 line-clamp-3 flex-1 text-base leading-relaxed text-slate-500">
              {{ getNewsField(item, 'description') }}
            </p>
            <span
              class="mt-5 inline-flex items-center gap-1 text-base font-medium text-cyan-700 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {{ t({ zh: '阅读全文', en: 'Read more' }) }}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
