import type { LocalizedText, NavItem } from '@/types'

export interface NavLink extends NavItem {
  label: LocalizedText
}

export const navLinks: NavLink[] = [
  { key: 'home', path: '/', label: { zh: '首页', en: 'Home' } },
  { key: 'publications', path: '/publications', label: { zh: '成果', en: 'Achievements' } },
  { key: 'team', path: '/team', label: { zh: '团队', en: 'Team' } },
  { key: 'news', path: '/news', label: { zh: '新闻', en: 'News' } },
  { key: 'projects', path: '/projects', label: { zh: '项目', en: 'Projects' } },
  { key: 'join', path: '/join', label: { zh: '加入我们', en: 'Join Us' } },
]

export const labName: LocalizedText = {
  zh: 'EIT-NLP 实验室',
  en: 'EIT-NLP Lab',
}
