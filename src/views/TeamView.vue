<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  directusPublicAssetUrl,
  fetchTeamHistoryMember,
  fetchTeamLeaderInfo,
  fetchTeamMember,
  type TeamHistoryMemberRecord,
  type TeamLeaderInfoRecord,
  type TeamMemberRecord,
} from '@/api/directus'
import { useLocale } from '@/composables/useLocale'
import { renderMarkdown } from '@/utils/markdown'
import { getTranslatedExperienceField, getTranslatedField } from '@/utils/translation'
import { normalizeExternalUrl } from '@/utils/url'

const { t, locale } = useLocale()
const teamMembers = ref<TeamMemberRecord[]>([])
const teamHistoryMember = ref<TeamHistoryMemberRecord | null>(null)
const teamLeaderInfo = ref<TeamLeaderInfoRecord | null>(null)

const defaultAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"%3E%3Crect width="128" height="128" rx="64" fill="%23e0f2fe"/%3E%3Ccircle cx="64" cy="46" r="24" fill="%230e7490"/%3E%3Cpath d="M24 112c6-24 22-38 40-38s34 14 40 38" fill="%230e7490"/%3E%3C/svg%3E'

// const totalMembers = computed(() => teamMembers.value.length)

function getTypeOrder(members: TeamMemberRecord[]) {
  const order = Number(members[0]?.order)
  return Number.isFinite(order) ? order : -1
}

function compareTypeGroups(
  [, membersA]: [string, TeamMemberRecord[]],
  [, membersB]: [string, TeamMemberRecord[]],
) {
  const orderA = getTypeOrder(membersA)
  const orderB = getTypeOrder(membersB)
  const isLastA = orderA === -1
  const isLastB = orderB === -1

  if (isLastA && isLastB) return 0
  if (isLastA) return 1
  if (isLastB) return -1
  return orderA - orderB
}

const teamMemberGroups = computed(() => {
  const grouped = new Map<string, TeamMemberRecord[]>()
  for (const member of teamMembers.value) {
    const type = member.type || 'Team Members'
    const list = grouped.get(type) ?? []
    list.push(member)
    grouped.set(type, list)
  }

  return [...grouped.entries()]
    .sort(compareTypeGroups)
    .map(([type, members]) => ({
      key: type,
      label: getMemberType(members[0]) || type,
      members,
    }))
})

const teamAssistantHtml = computed(() => {
  if (!teamHistoryMember.value) return ''
  const markdown = getTranslatedField(teamHistoryMember.value, 'assistant', locale.value).trim()
  return markdown ? renderMarkdown(markdown) : ''
})

const teamHistoryHtml = computed(() => {
  if (!teamHistoryMember.value) return ''
  const markdown = getTranslatedField(teamHistoryMember.value, 'history', locale.value).trim()
  return markdown ? renderMarkdown(markdown) : ''
})

function getMemberName(member: TeamMemberRecord) {
  return getTranslatedField(member, 'name', locale.value)
}

function getMemberType(member: TeamMemberRecord) {
  return getTranslatedField(member, 'type', locale.value)
}

function getMemberRole(member: TeamMemberRecord) {
  return getTranslatedField(member, 'title', locale.value)
}

function getMemberResearch(member: TeamMemberRecord) {
  return getTranslatedField(member, 'description', locale.value)
}

function getMemberAvatar(member: TeamMemberRecord) {
  return member.avatar ? directusPublicAssetUrl(member.avatar) : defaultAvatar
}

function getMemberLink(member: TeamMemberRecord) {
  return normalizeExternalUrl(member.link)
}

function getLeaderField(field: string) {
  return getTranslatedField(teamLeaderInfo.value, field, locale.value)
}

function getLeaderAvatar() {
  return teamLeaderInfo.value?.avatar ? directusPublicAssetUrl(teamLeaderInfo.value.avatar) : defaultAvatar
}

function getLeaderExperience() {
  return getTranslatedExperienceField(teamLeaderInfo.value, locale.value)
}

onMounted(async () => {
  const [memberResult, leaderResult, historyResult] = await Promise.allSettled([
    fetchTeamMember(),
    fetchTeamLeaderInfo(),
    fetchTeamHistoryMember(),
  ])

  if (memberResult.status === 'fulfilled') {
    teamMembers.value = memberResult.value?.data ?? []
  } else {
    console.error('[TeamView] fetchTeamMember failed:', memberResult.reason)
  }

  if (leaderResult.status === 'fulfilled') {
    teamLeaderInfo.value = leaderResult.value?.data ?? null
  } else {
    console.error('[TeamView] fetchTeamLeaderInfo failed:', leaderResult.reason)
  }

  if (historyResult.status === 'fulfilled') {
    teamHistoryMember.value = historyResult.value?.data ?? null
  } else {
    console.error('[TeamView] fetchTeamHistoryMember failed:', historyResult.reason)
  }
})
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
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">{{ getLeaderField('teamInfo') }}</p>
    </header>

    <!-- PI -->
    <section v-if="teamLeaderInfo" aria-labelledby="pi-heading">
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

        <div class="relative px-6 py-6 sm:p-8 lg:px-10 lg:py-10">
          <span
            class="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium tracking-wide text-cyan-300"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            {{ getLeaderField('tag') }}
          </span>

          <!-- 首行：姓名 / 职务 / 研究方向 与右上角照片同一水平带 -->
          <div
            class="mt-5 flex flex-col gap-6 sm:mt-6 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_16rem]"
          >
            <div class="order-2 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1 lg:pr-2">
              <h3 class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {{ getLeaderField('name') }}
              </h3>
              <p class="mt-2 text-lg text-cyan-300/90 sm:mt-3 sm:text-xl">{{ getLeaderField('role') }}</p>
              <p class="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                <span class="font-medium text-slate-200">
                  {{ t({ zh: '研究方向', en: 'Research' }) }}：
                </span>
                {{ getLeaderField('research') }}
              </p>
            </div>

            <div
              class="order-1 mx-auto w-full max-w-[200px] shrink-0 sm:max-w-[240px] lg:order-none lg:col-start-2 lg:row-start-1 lg:mx-0 lg:w-full lg:max-w-none"
            >
              <div
                class="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-800/60 ring-2 ring-cyan-500/30 ring-offset-2 ring-offset-slate-900"
              >
                <img
                  :src="getLeaderAvatar()"
                  :alt="getLeaderField('name')"
                  class="absolute inset-0 block h-full w-full object-contain object-top"
                  loading="eager"
                  decoding="async"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-slate-900/35 lg:to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <!-- 下方：简介与经历全宽铺满（含照片下方区域） -->
          <div
            v-if="getLeaderField('bio') || getLeaderExperience()"
            class="mt-6 space-y-5 border-t border-white/10 pt-6 sm:mt-8 sm:space-y-6 sm:pt-8"
          >
            <p v-if="getLeaderField('bio')" class="text-base leading-relaxed text-slate-400 sm:text-lg">
              {{ getLeaderField('bio') }}
            </p>
            <p
              v-if="getLeaderExperience()"
              class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm leading-relaxed whitespace-pre-line text-slate-400"
            >
              {{ getLeaderExperience() }}
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
        <!-- <p class="text-base text-slate-500 sm:text-lg">
          {{ totalMembers }}
          {{ t({ zh: ' 人', en: ' members' }) }}
        </p> -->
      </div>

      <div
        v-for="group in teamMemberGroups"
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
            {{ getMemberType(group.members[0]) || group.key }}
          </h3>
          <span
            class="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 sm:text-base"
          >
            {{ group.members.length }}{{ t({ zh: ' 人', en: ' members' }) }}
          </span>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          <article
            v-for="member in group.members"
            :key="member.id"
            class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200/60 hover:shadow-md"
          >
            <div
              class="absolute top-0 right-0 left-0 h-20 bg-gradient-to-br from-slate-100 to-cyan-50/50"
              aria-hidden="true"
            />
            <div class="relative px-4 pt-4 pb-4">
              <div class="relative mx-auto w-fit">
                <div
                  class="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/40 to-slate-300/40 opacity-0 blur transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
                <img
                  :src="getMemberAvatar(member)"
                  :alt="getMemberName(member)"
                  class="relative h-20 w-20 rounded-full object-cover ring-2 ring-white sm:h-24 sm:w-24"
                  loading="lazy"
                />
              </div>
              <div class="mt-3 text-center">
                <h4 class="text-base font-semibold text-slate-900 sm:text-lg">
                  <a
                    v-if="getMemberLink(member)"
                    :href="getMemberLink(member)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="transition-colors hover:text-cyan-700"
                  >
                    {{ getMemberName(member) }}
                  </a>
                  <template v-else>{{ getMemberName(member) }}</template>
                </h4>
                <p class="mt-1.5 text-sm font-medium text-cyan-700">
                  {{ getMemberRole(member) }}
                </p>
              </div>
              <p
                class="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs leading-relaxed text-slate-600 sm:text-sm"
              >
                {{ getMemberResearch(member) }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- 科研助理 -->
      <div
        v-if="teamAssistantHtml"
        class="scroll-mt-24"
        aria-labelledby="assistant-heading"
      >
        <div
          class="flex flex-col gap-2 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <h3
            id="assistant-heading"
            class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {{ t({ zh: '科研助理', en: 'Research Assistants' }) }}
          </h3>
        </div>

        <div class="markdown-content mt-6" v-html="teamAssistantHtml" />
      </div>

      <div
        v-if="teamHistoryHtml"
        class="scroll-mt-24"
        aria-labelledby="history-members-heading"
      >
        <div
          class="flex flex-col gap-2 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <h3
            id="history-members-heading"
            class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {{ t({ zh: '历史成员', en: 'Alumni' }) }}
          </h3>
        </div>

        <div class="markdown-content mt-6" v-html="teamHistoryHtml" />
      </div>
    </section>
  </div>
</template>
