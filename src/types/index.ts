export type Locale = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export interface Publication {
  id: string
  title: LocalizedText
  authors: LocalizedText
  venue: LocalizedText
  year: number
  link: string
}

export interface NewsItem {
  id: string
  date: string
  title: LocalizedText
  summary: LocalizedText
  content: LocalizedText
  image: string
}

export type TeamMemberGroup =
  | 'phd'
  | 'engineer'
  | 'postdoc'
  | 'assistant'
  | 'advisor'
  | 'industry'

export interface TeamGroupMeta {
  key: TeamMemberGroup
  label: LocalizedText
}

export interface TeamMember {
  id: string
  name: LocalizedText
  role: LocalizedText
  research: LocalizedText
  avatar: string
  isPI?: boolean
  group?: TeamMemberGroup
  bio?: LocalizedText
  experience?: LocalizedText
}

export interface Project {
  id: string
  title: LocalizedText
  description: LocalizedText
  isFeatured?: boolean
  mediaType: 'video' | 'image'
  mediaUrl: string
}

export interface HomeContent {
  hero: {
    title: LocalizedText
    tagline: LocalizedText
    vision: LocalizedText
  }
  intro: {
    title: LocalizedText
    body: LocalizedText
  }
}

export interface ApplicationGuideStep {
  title: LocalizedText
  description: LocalizedText
}

export interface JoinContent {
  vision: LocalizedText
  contactEmail: string
  positions: Position[]
  applicationGuide: {
    title: LocalizedText
    intro: LocalizedText
    steps: ApplicationGuideStep[]
    tips: LocalizedText[]
  }
}

export interface Position {
  id: string
  title: LocalizedText
  type: LocalizedText
  research: LocalizedText
  requirements: LocalizedText[]
}

export interface NavItem {
  key: string
  path: string
}
