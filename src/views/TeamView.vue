<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import { useLab } from '@/composables/useLab'

const { t } = useLocale()
const lab = useLab()

const totalMembers = lab.members.length
</script>

<template>
  <div class="space-y-16 text-base sm:space-y-20 sm:text-lg">
    <!-- Page header -->
    <header class="border-b border-slate-200/80 pb-8 sm:pb-10">
      <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
        {{ t({ zh: '人员', en: 'People' }) }}
      </span>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {{ t({ zh: '研究团队', en: 'Our Team' }) }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
        {{
          t({
            zh: '汇聚多模态 AI 与机器人学领域的优秀研究者，共同探索具身智能前沿。',
            en: 'Researchers in multimodal AI and robotics advancing embodied intelligence.',
          })
        }}
      </p>
    </header>

    <!-- PI -->
    <section v-if="lab.pi" aria-labelledby="pi-heading">
      <h2 id="pi-heading" class="sr-only">
        {{ t({ zh: '实验室负责人', en: 'Principal Investigator' }) }}
      </h2>
      <article
        class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white shadow-xl"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl"
          aria-hidden="true"
        />

        <div class="relative flex flex-col lg:flex-row">
          <div
            class="relative mx-auto w-full max-w-sm shrink-0 p-6 pb-0 sm:max-w-none sm:p-8 lg:w-80 lg:pb-8"
          >
            <div
              class="relative mx-auto aspect-[4/5] max-h-[320px] w-full overflow-hidden rounded-xl ring-2 ring-cyan-500/30 ring-offset-2 ring-offset-slate-900 sm:max-h-none lg:aspect-auto lg:h-full lg:min-h-[380px] lg:max-h-none"
            >
              <img
                :src="lab.pi.avatar"
                :alt="t(lab.pi.name)"
                class="h-full w-full object-cover object-top"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/40"
                aria-hidden="true"
              />
            </div>
          </div>

          <div class="relative flex flex-1 flex-col justify-center px-6 pb-8 pt-4 sm:px-8 sm:pb-10 lg:py-10 lg:pr-10">
            <span
              class="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium tracking-wide text-cyan-300"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
              {{ t({ zh: '实验室负责人', en: 'Principal Investigator' }) }}
            </span>
            <h3 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {{ t(lab.pi.name) }}
            </h3>
            <p class="mt-3 text-lg text-cyan-300/90 sm:text-xl">{{ t(lab.pi.role) }}</p>
            <p class="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
              <span class="font-medium text-slate-200">
                {{ t({ zh: '研究方向', en: 'Research' }) }}：
              </span>
              {{ t(lab.pi.research) }}
            </p>
            <p v-if="lab.pi.bio" class="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
              {{ t(lab.pi.bio) }}
            </p>
            <p
              v-if="lab.pi.experience"
              class="mt-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm leading-relaxed text-slate-400"
            >
              {{ t(lab.pi.experience) }}
            </p>
          </div>
        </div>
      </article>
    </section>

    <!-- Grouped members -->
    <section aria-labelledby="members-heading" class="space-y-14 sm:space-y-16">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="font-mono text-sm font-medium tracking-widest text-cyan-600 uppercase">
            {{ t({ zh: '成员', en: 'Members' }) }}
          </span>
          <h2
            id="members-heading"
            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {{ t({ zh: '团队成员', en: 'Team Members' }) }}
          </h2>
        </div>
        <p class="text-base text-slate-500 sm:text-lg">
          {{ totalMembers }}
          {{ t({ zh: ' 人', en: ' members' }) }}
        </p>
      </div>

      <div
        v-for="group in lab.membersByGroup"
        :key="group.key"
        class="scroll-mt-24"
        :aria-labelledby="`group-${group.key}`"
      >
        <div
          class="flex flex-col gap-2 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <h3
            :id="`group-${group.key}`"
            class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {{ t(group.label) }}
          </h3>
          <span
            class="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 sm:text-base"
          >
            {{ group.members.length }}{{ t({ zh: ' 人', en: ' members' }) }}
          </span>
        </div>

        <div class="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <article
            v-for="member in group.members"
            :key="member.id"
            class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-200/60 hover:shadow-lg"
          >
            <div
              class="absolute top-0 right-0 left-0 h-28 bg-gradient-to-br from-slate-100 to-cyan-50/50"
              aria-hidden="true"
            />
            <div class="relative px-6 pt-6 pb-6">
              <div class="relative mx-auto w-fit">
                <div
                  class="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/40 to-slate-300/40 opacity-0 blur transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
                <img
                  :src="member.avatar"
                  :alt="t(member.name)"
                  class="relative h-28 w-28 rounded-full object-cover ring-4 ring-white sm:h-32 sm:w-32"
                  loading="lazy"
                />
              </div>
              <div class="mt-5 text-center">
                <h4 class="text-xl font-semibold text-slate-900 sm:text-2xl">
                  {{ t(member.name) }}
                </h4>
                <p class="mt-2 text-base font-medium text-cyan-700 sm:text-lg">
                  {{ t(member.role) }}
                </p>
              </div>
              <p
                class="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm leading-relaxed text-slate-600 sm:text-base"
              >
                {{ t(member.research) }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
