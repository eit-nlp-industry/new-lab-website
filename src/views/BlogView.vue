<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { directusPublicAssetUrl, fetchBlogs, type BlogRecord } from '@/api/directus'
import { useLocale } from '@/composables/useLocale'
import { getTranslatedField } from '@/utils/translation'

const { t, locale } = useLocale()
const blogRecords = ref<BlogRecord[]>([])

function formatBlogDate(value: unknown) {
  const raw = String(value ?? '').trim()
  const isoDate = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  return isoDate?.[1] ?? raw
}

const blogs = computed(() =>
  blogRecords.value
    .map((post) => {
      const publishedAt = Date.parse(String(post.published_at ?? ''))
      return {
        id: post.id,
        slug: String(post.slug || post.id),
        title: getTranslatedField(post, 'title', locale.value),
        summary: getTranslatedField(post, 'summary', locale.value),
        author: getTranslatedField(post, 'author', locale.value),
        date: formatBlogDate(post.published_at),
        cover: post.cover ? directusPublicAssetUrl(post.cover) : '',
        publishedAt: Number.isNaN(publishedAt) ? 0 : publishedAt,
      }
    })
    .filter((post) => post.title)
    .sort((a, b) => b.publishedAt - a.publishedAt || Number(b.id) - Number(a.id)),
)

onMounted(async () => {
  try {
    const res = await fetchBlogs()
    blogRecords.value = res?.data ?? []
  } catch (error) {
    console.error('[BlogView] fetchBlogs failed:', error)
  }
})
</script>

<template>
  <div class="space-y-16 text-base sm:space-y-20 sm:text-lg">
    <header class="border-b border-slate-200/80 pb-8 sm:pb-10">
      <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
        {{ t({ zh: '技术分享', en: 'Technical Notes' }) }}
      </span>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ t({ zh: '博客', en: 'Blog' }) }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
        {{
          t({
            zh: '实验室的技术笔记与实践记录，点击卡片阅读全文。',
            en: 'Technical notes and practical write-ups from the lab. Open a card to read the full post.',
          })
        }}
      </p>
      <p class="mt-4 font-mono text-sm text-slate-400 sm:text-base">
        {{ blogs.length }}
        {{ t({ zh: ' 篇', en: ' posts' }) }}
      </p>
    </header>

    <p
      v-if="!blogs.length"
      class="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center text-base text-slate-500"
    >
      {{ t({ zh: '暂无博客', en: 'No posts yet' }) }}
    </p>

    <ul v-else class="space-y-4">
      <li v-for="post in blogs" :key="post.id">
        <RouterLink
          :to="{ name: 'blog-detail', params: { slug: post.slug } }"
          class="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-cyan-200/80 hover:shadow-lg sm:gap-6 sm:p-6"
        >
          <div class="min-w-0 flex-1">
            <p
              v-if="post.author || post.date"
              class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600 sm:text-sm"
            >
              <!-- <span v-if="post.author">{{ post.author }}</span> -->
              <!-- <span v-if="post.author && post.date" class="text-slate-400">·</span> -->
              <span v-if="post.date">{{ post.date }}</span>
            </p>
            <h2 class="mt-3 text-base font-semibold leading-snug text-slate-900 group-hover:text-cyan-800 sm:text-lg">
              {{ post.title }}
            </h2>
            <p v-if="post.summary" class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              {{ post.summary }}
            </p>
            <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-700 sm:text-base">
              {{ t({ zh: '阅读全文', en: 'Read more' }) }}
              <span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </span>
          </div>

          <div class="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40">
            <img
              v-if="post.cover"
              :src="post.cover"
              :alt="post.title"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 font-mono text-sm font-medium text-cyan-200/90"
            >
              Blog
            </div>
            <span
              class="absolute right-0 bottom-0 left-0 h-0.5 origin-right scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100"
              aria-hidden="true"
            />
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
