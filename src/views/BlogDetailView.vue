<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  directusPublicAssetUrl,
  fetchBlogs,
  withDirectusAccessToken,
  type BlogRecord,
} from '@/api/directus'
import { useLocale } from '@/composables/useLocale'
import { extractDirectusFileId, renderBlogContent } from '@/utils/markdown'
import { getTranslatedField } from '@/utils/translation'

const route = useRoute()
const { t, locale } = useLocale()
const posts = ref<BlogRecord[]>([])
const loaded = ref(false)

const article = computed(() => {
  const key = String(route.params.slug ?? '')
  return posts.value.find((item) => String(item.slug || item.id) === key)
})

function formatBlogDate(value: unknown) {
  const raw = String(value ?? '').trim()
  const isoDate = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  return isoDate?.[1] ?? raw
}

const title = computed(() => getTranslatedField(article.value, 'title', locale.value))
const summary = computed(() => getTranslatedField(article.value, 'summary', locale.value))
const author = computed(() => getTranslatedField(article.value, 'author', locale.value))
const date = computed(() => formatBlogDate(article.value?.published_at))
const cover = computed(() =>
  article.value?.cover ? directusPublicAssetUrl(article.value.cover) : '',
)
const contentHtml = computed(() =>
  renderBlogContent(getTranslatedField(article.value, 'content', locale.value)),
)

const backTo = '/blog'

function setMediaSrc(el: HTMLImageElement | HTMLVideoElement | HTMLSourceElement, next: string) {
  el.setAttribute('src', next)
  el.src = next
  if (el instanceof HTMLVideoElement) {
    el.load()
    return
  }
  if (el instanceof HTMLSourceElement && el.parentElement instanceof HTMLVideoElement) {
    el.parentElement.load()
  }
}

/** v-html 里的图/视频加载失败时：先带 token，再回退到原文地址。 */
function onContentMediaError(event: Event) {
  const el = event.target
  if (
    !(el instanceof HTMLImageElement) &&
    !(el instanceof HTMLVideoElement) &&
    !(el instanceof HTMLSourceElement)
  ) {
    return
  }

  const step = Number(el.dataset.assetRetry || '0')
  const current = el.getAttribute('src') || el.src
  const assetId = el.dataset.assetId || extractDirectusFileId(current)
  const original = el.dataset.originalSrc || ''
  const authed = assetId ? withDirectusAccessToken(directusPublicAssetUrl(assetId)) : ''

  const next =
    step === 0 && authed && authed !== current
      ? authed
      : step === 1 && original && original !== current
        ? original
        : ''
  if (!next) return

  el.dataset.assetRetry = String(step + 1)
  setMediaSrc(el, next)
}

async function loadPosts() {
  loaded.value = false
  try {
    const res = await fetchBlogs()
    posts.value = res?.data ?? []
  } catch (error) {
    console.error('[BlogDetailView] fetchBlogs failed:', error)
    posts.value = []
  } finally {
    loaded.value = true
  }
}

watch(
  () => route.params.slug,
  () => {
    if (!posts.value.length) void loadPosts()
  },
)

onMounted(loadPosts)
</script>

<template>
  <div v-if="!loaded" class="py-20 text-center text-base text-slate-400 sm:text-lg">
    {{ t({ zh: '正在加载…', en: 'Loading…' }) }}
  </div>

  <div v-else-if="article" class="space-y-10 text-base sm:space-y-12 sm:text-lg">
    <RouterLink
      :to="backTo"
      class="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-base font-medium text-slate-700 shadow-sm transition-all hover:border-cyan-200 hover:bg-cyan-50/50 hover:text-cyan-800"
    >
      <svg
        class="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {{ t({ zh: '返回博客', en: 'Back to blog' }) }}
    </RouterLink>

    <article>
      <header>
        <h1 class="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {{ title }}
        </h1>
        <p v-if="summary" class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl">
          {{ summary }}
        </p>
      </header>

      <!-- <img
        v-if="cover"
        :src="cover"
        :alt="title"
        class="mt-10 aspect-[2/1] w-full rounded-2xl object-cover shadow-xl shadow-slate-200/60"
      /> -->

      <div
        v-if="contentHtml"
        class="markdown-content mt-10 max-w-none rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/80 to-white p-6 sm:p-10 lg:p-12"
        @error.capture="onContentMediaError"
        v-html="contentHtml"
      />

      <p
        v-if="author || date"
        class="mt-8 inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-slate-500 sm:text-base"
      >
        <span v-if="author">{{ author }}</span>
        <span v-if="author && date" aria-hidden="true">·</span>
        <time v-if="date">{{ date }}</time>
      </p>
    </article>

    <div class="border-t border-slate-200/80 pt-8">
      <RouterLink
        :to="backTo"
        class="inline-flex items-center gap-2 text-base font-medium text-cyan-700 transition-colors hover:text-cyan-900"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t({ zh: '返回博客列表', en: 'Back to blog' }) }}
      </RouterLink>
    </div>
  </div>

  <div
    v-else
    class="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/50 px-6 py-20 text-center"
  >
    <p class="text-xl font-semibold text-slate-900 sm:text-2xl">
      {{ t({ zh: '未找到该博客', en: 'Post not found' }) }}
    </p>
    <p class="mt-3 text-base text-slate-500 sm:text-lg">
      {{
        t({
          zh: '该链接可能已失效，或文章尚未发布。',
          en: 'The link may be invalid, or the post is not published yet.',
        })
      }}
    </p>
    <RouterLink
      :to="backTo"
      class="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
    >
      {{ t({ zh: '返回博客', en: 'Back to blog' }) }}
    </RouterLink>
  </div>
</template>
