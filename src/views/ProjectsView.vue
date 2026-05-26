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
        {{ t({ zh: '成果展示', en: 'Showcase' }) }}
      </span>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ t({ zh: '研究项目', en: 'Research Projects' }) }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
        {{
          t({
            zh: '探索实验室在具身智能与多模态系统方面的核心成果与平台。',
            en: 'Core platforms and systems in embodied AI and multimodal intelligence.',
          })
        }}
      </p>
    </header>

    <!-- Featured: video player placeholder -->
    <section v-if="lab.featuredProject" aria-labelledby="featured-heading">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800"
          >
            {{ t({ zh: '主项目', en: 'Featured Project' }) }}
          </span>
          <h2
            id="featured-heading"
            class="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {{ t(lab.featuredProject.title) }}
          </h2>
        </div>
      </div>

      <article
        class="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60"
      >
        <!-- Simulated video player -->
        <div
          class="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          role="img"
          :aria-label="t({ zh: '项目演示视频占位', en: 'Project demo video placeholder' })"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-900/30"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"
            aria-hidden="true"
          />

          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl shadow-cyan-500/20 backdrop-blur-md transition-transform hover:scale-105 sm:h-24 sm:w-24"
            >
              <svg
                class="ml-1 h-10 w-10 text-white sm:h-12 sm:w-12"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div
            class="absolute top-4 left-4 rounded-md bg-black/50 px-3 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-sm sm:text-sm"
          >
            {{ t({ zh: '演示视频', en: 'Demo Video' }) }}
          </div>

          <div class="absolute right-0 bottom-0 left-0 px-4 pb-4 pt-16 sm:px-6 sm:pb-5">
            <div class="flex items-center gap-3">
              <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                <div class="h-full w-1/3 rounded-full bg-cyan-400" aria-hidden="true" />
              </div>
              <span class="font-mono text-xs text-white/70 sm:text-sm">02:34 / 08:12</span>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100 p-6 sm:p-8 lg:p-10">
          <p class="text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
            {{ t(lab.featuredProject.description) }}
          </p>
          <p class="mt-4 text-sm text-slate-400 sm:text-base">
            {{
              t({
                zh: '※ 视频播放器为占位展示，正式版本将嵌入项目演示录像。',
                en: '※ Video area is a placeholder; the release will embed the project demo recording.',
              })
            }}
          </p>
        </div>
      </article>
    </section>

    <!-- Other projects: alternating text / media layout -->
    <section aria-labelledby="projects-list-heading">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
            {{ t({ zh: '更多项目', en: 'More Projects' }) }}
          </span>
          <h2
            id="projects-list-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {{ t({ zh: '其他项目', en: 'Other Projects' }) }}
          </h2>
        </div>
        <p class="text-base text-slate-500 sm:text-lg">
          {{ lab.otherProjects.length }}
          {{ t({ zh: ' 个项目', en: ' projects' }) }}
        </p>
      </div>

      <div class="mt-10 space-y-8 sm:space-y-10">
        <article
          v-for="(project, index) in lab.otherProjects"
          :key="project.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-cyan-200/60 hover:shadow-lg sm:flex-row"
        >
          <!-- 偶数：描述左 / 媒体右；奇数：媒体左 / 描述右 -->
          <div
            class="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10"
            :class="index % 2 === 0 ? 'order-1 sm:order-1' : 'order-2 sm:order-2'"
          >
            <h3
              class="text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-cyan-800 sm:text-2xl"
            >
              {{ t(project.title) }}
            </h3>
            <p class="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
              {{ t(project.description) }}
            </p>
          </div>

          <div
            class="relative h-52 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:min-h-[280px] sm:w-2/5 lg:w-[42%]"
            :class="index % 2 === 0 ? 'order-2 sm:order-2' : 'order-1 sm:order-1'"
          >
            <img
              :src="project.mediaUrl"
              :alt="t(project.title)"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-slate-900/30"
              aria-hidden="true"
            />
            <span
              class="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm sm:text-sm"
            >
              {{
                project.mediaType === 'image'
                  ? t({ zh: '图文', en: 'Gallery' })
                  : t({ zh: '视频', en: 'Video' })
              }}
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
