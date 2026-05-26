import { computed } from 'vue'
import { defineStore } from 'pinia'
import * as mock from '@/data/mock'
import type { NewsItem, Publication, TeamGroupMeta, TeamMember } from '@/types'

export const useLabStore = defineStore('lab', () => {
  const home = mock.home
  const publications = mock.publications
  const news = mock.news
  const team = mock.team
  const teamGroups = mock.teamGroups
  const projects = mock.projects
  const join = mock.join

  const latestPublications = computed(() =>
    [...publications].sort((a, b) => b.year - a.year).slice(0, 5),
  )

  const latestNews = computed(() =>
    [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
  )

  const sortedNews = computed(() =>
    [...news].sort((a, b) => b.date.localeCompare(a.date)),
  )

  const publicationsByYear = computed(() => {
    const grouped = new Map<number, Publication[]>()
    for (const pub of publications) {
      const list = grouped.get(pub.year) ?? []
      list.push(pub)
      grouped.set(pub.year, list)
    }
    return [...grouped.entries()]
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, pubs]) => [year, [...pubs].reverse()] as [number, Publication[]])
  })

  const pi = computed(() => team.find((m) => m.isPI))

  const members = computed(() => team.filter((m) => !m.isPI))

  const membersByGroup = computed(() =>
    teamGroups
      .map((group: TeamGroupMeta) => ({
        ...group,
        members: team.filter((m) => !m.isPI && m.group === group.key) as TeamMember[],
      }))
      .filter((g) => g.members.length > 0),
  )

  const featuredProject = computed(() => projects.find((p) => p.isFeatured))

  const otherProjects = computed(() => projects.filter((p) => !p.isFeatured))

  function getNewsById(id: string): NewsItem | undefined {
    return news.find((n) => n.id === id)
  }

  return {
    home,
    publications,
    news,
    team,
    projects,
    join,
    latestPublications,
    latestNews,
    sortedNews,
    publicationsByYear,
    pi,
    members,
    teamGroups,
    membersByGroup,
    featuredProject,
    otherProjects,
    getNewsById,
  }
})
