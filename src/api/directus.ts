import axios from 'axios'

// ─────────────────────────────────────────────
// 基础配置
// ─────────────────────────────────────────────
// 开发环境优先走 Vite 代理，避免浏览器 CORS
// 生产环境可通过 VITE_API_BASE_URL 覆盖为实际后端地址
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/nlp-api' : 'https://idt.eitech.edu.cn/nlp-api')

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '_G3jnm6gmjO7eZMkfmj6kOrYtl1o07eY'

const requestCache = new Map<string, any>()
const pendingRequestCache = new Map<string, Promise<any>>()

function normalizeDirectusBaseUrl(baseUrl: string) {
  if (!baseUrl) return ''
  let u = String(baseUrl).replace(/\/+$/, '')
  u = u.replace(/\/admin(?:\/.*)?$/i, '')
  return u
}

function stableStringify(value: any): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`
  const keys = Object.keys(value).sort()
  const entries = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
  return `{${entries.join(',')}}`
}

function createRequestCacheKey(path: string, params: Record<string, any>, token?: string) {
  return `${path}::${stableStringify(params || {})}::${token || ''}`
}

function clearCacheByPathPrefix(prefix: string) {
  for (const key of requestCache.keys()) {
    if (key.startsWith(`${prefix}::`)) requestCache.delete(key)
  }
  for (const key of pendingRequestCache.keys()) {
    if (key.startsWith(`${prefix}::`)) pendingRequestCache.delete(key)
  }
}

export type DirectusAssetUrlOptions = {
  /** 是否在 URL 上附加 access_token（默认 false，Public 可读资源不应带 token） */
  withToken?: boolean
  [key: string]: string | number | boolean | undefined
}

/** 公开资源 URL（论文图片、头像、新闻图等），不带 token */
export function directusPublicAssetUrl(
  fileRef: unknown,
  params: Omit<DirectusAssetUrlOptions, 'withToken'> = {},
) {
  return directusAssetUrl(fileRef, { ...params, withToken: false })
}

/** 带 token 的资源 URL（非 Public 且 token 角色有读权限时使用） */
export function directusAuthedAssetUrl(
  fileRef: unknown,
  params: Omit<DirectusAssetUrlOptions, 'withToken'> = {},
) {
  return directusAssetUrl(fileRef, { ...params, withToken: true })
}

export function directusAssetUrl(fileRef: any, options: DirectusAssetUrlOptions = {}) {
  if (!fileRef) return ''
  const raw =
    typeof fileRef === 'string' ? fileRef : fileRef?.id || fileRef?.filename_disk || ''
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw

  const base = normalizeDirectusBaseUrl(BASE_URL)
  const assetPath = raw.startsWith('/assets/')
    ? raw
    : raw.startsWith('assets/')
      ? `/${raw}`
      : `/assets/${raw}`

  const { withToken = false, ...params } = options
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === '' || k === 'withToken') continue
    qs.set(k, String(v))
  }
  // 仅显式要求时附加 token。默认不带：Public 资源可匿名访问；带 token 反而按 token 角色鉴权，可能导致 403
  if (withToken && API_TOKEN && !qs.has('access_token')) {
    qs.set('access_token', API_TOKEN)
  }
  const query = qs.toString()
  return `${base}${assetPath}${query ? `?${query}` : ''}`
}

/** 在已有资源 URL 上附加 access_token，供 @error 回退或访问非 Public 资源 */
export function withDirectusAccessToken(url: string): string {
  if (!url || !API_TOKEN || url.includes('access_token=')) return url
  const joiner = url.includes('?') ? '&' : '?'
  return `${url}${joiner}access_token=${encodeURIComponent(API_TOKEN)}`
}

/** Public URL 加载失败时，尝试带 token 的 URL（适用于 img / video @error） */
export function onDirectusAssetError(event: Event, fallbackUrl?: string) {
  const el = event.target as HTMLImageElement | HTMLVideoElement | null
  if (!el?.src || !fallbackUrl || el.src === fallbackUrl) return
  el.src = fallbackUrl
}

/** 视频等可能非 Public 的资源：先公开 URL，失败再回退带 token 的 URL */
export function getDirectusAssetFallbackPair(fileRef: unknown) {
  const publicUrl = directusPublicAssetUrl(fileRef)
  const authedUrl = publicUrl ? withDirectusAccessToken(publicUrl) : ''
  return { publicUrl, authedUrl }
}

export function onDirectusAssetErrorWithToken(event: Event, fileRef: unknown) {
  const { authedUrl } = getDirectusAssetFallbackPair(fileRef)
  onDirectusAssetError(event, authedUrl)
}

export const DIRECTUS_LANG_CODE = {
  zh: import.meta.env.VITE_DIRECTUS_LANG_ZH || 'zh-CN',
  en: import.meta.env.VITE_DIRECTUS_LANG_EN || 'en-US',
} as const

export type UiLang = 'zh' | 'en'

export function toDirectusLangCode(lang: UiLang) {
  return DIRECTUS_LANG_CODE[lang] || DIRECTUS_LANG_CODE.zh
}

type DirectusGetOptions = {
  token?: string
  timeout?: number
  forceRefresh?: boolean
}

async function directusGet(path: string, params: Record<string, any> = {}, options: DirectusGetOptions = {}) {
  const token = options.token || API_TOKEN
  const cacheKey = createRequestCacheKey(path, params, token)

  if (options.forceRefresh !== true) {
    if (requestCache.has(cacheKey)) return requestCache.get(cacheKey)
    if (pendingRequestCache.has(cacheKey)) return pendingRequestCache.get(cacheKey)
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const requestPromise = axios
      .get(`${BASE_URL}${path}`, {
        timeout: options.timeout ?? 10_000,
        headers,
        params,
      })
      .then((response) => {
        requestCache.set(cacheKey, response.data)
        return response.data
      })
      .finally(() => {
        pendingRequestCache.delete(cacheKey)
      })

    pendingRequestCache.set(cacheKey, requestPromise)
    return await requestPromise
  } catch (error: any) {
    const label = path
    if (error?.response) {
      // eslint-disable-next-line no-console
      console.error(`❌ [${label}] HTTP ${error.response.status}`, error.response.data)
    } else if (error?.request) {
      // eslint-disable-next-line no-console
      console.error(`❌ [${label}] 无响应（网络/CORS）`, error.request)
    } else {
      // eslint-disable-next-line no-console
      console.error(`❌ [${label}] 请求错误`, error?.message || error)
    }
    throw error
  }
}

function translationParams(translationRelField = 'translations', langCode: string) {
  return {
    [`deep[${translationRelField}][_filter][languages_code][_eq]`]: langCode,
  }
}

export type FetchPapersOptions = DirectusGetOptions & {
  withTranslations?: boolean
  lang?: UiLang
  langCode?: string
  status?: string
  limit?: number
  offset?: number
}

export async function fetchPapers(options: FetchPapersOptions = {}) {
  let params: Record<string, any> = {}

  if (options.withTranslations) {
    const langCode = options.langCode || toDirectusLangCode(options.lang || 'zh')
    params = {
      fields: 'id,year,date,link,status,image,image_upload_url,authors,publisher,tags,buttons,paperImg.*',
      'filter[status][_eq]': options.status ?? 'published',
      sort: '-year,-date',
      limit: options.limit ?? 100,
      offset: options.offset ?? 0,
      ...translationParams('translations', langCode),
    }
  } else {
    params = {
      'filter[status][_eq]': options.status ?? 'published',
      sort: '-year,-date',
      limit: options.limit ?? 100,
      offset: options.offset ?? 0,
    }
  }

  const data = await directusGet('/items/paper', params, options)
  // eslint-disable-next-line no-console
  // console.log('✅ 论文数据请求成功!', data)
  return data
}

export type FetchPatentsOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface PatentRecord {
  [key: string]: unknown
  id: number | string
  title?: string
  image?: string | { id?: string; filename_disk?: string } | null
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    title?: string
  }>
}

/** 获取专利列表（含 translations，前端按语言切换） */
export async function fetchPatents(
  options: FetchPatentsOptions = {},
): Promise<DirectusListResponse<PatentRecord>> {
  const params = {
    fields: 'id,title,image,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/patent', params, options)
}

export function clearPatentsCache() {
  clearCacheByPathPrefix('/items/patent')
}

export function clearAllDirectusCache() {
  requestCache.clear()
  pendingRequestCache.clear()
}

export type FetchIntruduceOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface IntruduceRecord {
  [key: string]: unknown
  id?: number | string
  tag: string
  lab_name: string
  lab_description: string
  lab_about: string
  extra_info?: Array<{
    key?: string
    value?: string
  }>
  background_img?: string | { id?: string }
  translations?: Array<{
    languages_code?: string
    tag?: string
    lab_name?: string
    lab_description?: string
    lab_about?: string
    extra_info?: Array<{
      key?: string
      value?: string
    }>
  }>
}

export interface DirectusListResponse<T> {
  data: T[]
}

export interface DirectusItemResponse<T> {
  data: T
}

/** 获取实验室介绍（含 translations，前端按语言切换） */
export async function fetchIntruduce(
  options: FetchIntruduceOptions = {},
): Promise<DirectusItemResponse<IntruduceRecord>> {
  const params = {
    fields: 'tag,lab_name,lab_description,lab_about,extra_info,background_img,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/intruduce', params, options)
}

export function clearIntruduceCache() {
  clearCacheByPathPrefix('/items/intruduce')
}


/** 获取实验团队成员（含 translations，前端按语言切换） */
export type FetchTeamMemberOptions = DirectusGetOptions & {
  type?: string
  limit?: number
  offset?: number
}

export interface TeamMemberRecord {
  [key: string]: unknown
  id: number | string
  type?: string
  order?: number
  name: string
  title?: string
  description?: string
  link?: string
  avatar?: string | { id?: string; filename_disk?: string } | null
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    type?: string
    name?: string
    title?: string
    description?: string
  }>
}

export async function fetchTeamMember(
  options: FetchTeamMemberOptions = {},
): Promise<DirectusListResponse<TeamMemberRecord>> {
  const params: Record<string, any> = {
    fields: 'id,type,order,name,title,description,avatar,link,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }

  if (options.type) {
    params['filter[type][_eq]'] = options.type
  }

  return directusGet('/items/teamMember', params, options)
}

export type FetchTeamLeaderInfoOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface TeamLeaderInfoRecord {
  [key: string]: unknown
  id: number | string
  teamInfo?: string
  tag?: string
  avatar?: string | { id?: string; filename_disk?: string } | null
  name: string
  role?: string
  research?: string
  bio?: string
  experience?: string | Array<{ value?: string }>
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    teamInfo?: string
    tag?: string
    name?: string
    role?: string
    research?: string
    bio?: string
    experience?: string | Array<{ value?: string }>
  }>
}

/** 获取实验室负责人信息（含 translations，前端按语言切换） */
export function fetchTeamLeaderInfo(
  options: FetchTeamLeaderInfoOptions = {},
): Promise<DirectusItemResponse<TeamLeaderInfoRecord>> {
  const params = {
    fields: 'id,teamInfo,tag,avatar,name,role,research,bio,experience,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }

  return directusGet('/items/teamLeaderInfo', params, options)
}

/** 获取新闻列表（含 translations，前端按语言切换） */
export type FetchNewsOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface NewsRecord {
  [key: string]: unknown
  id: number | string
  title: string
  newsContent: string
  description: string
  date: string
  image?: string | number | null
  imgList: Array<string | number>
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    title?: string
    description?: string
    newsContent?: string
    date?: string
  }>
}

export async function fetchNews(
  options: FetchNewsOptions = {},
): Promise<DirectusListResponse<NewsRecord>> {
  const params = {
    fields: 'id,title,description,newsContent,date,image,imgList,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/news', params, options)
}

export type FetchProjectOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface ProjectRecord {
  [key: string]: unknown
  id: number | string
  type?: string
  title?: string
  content?: string
  projectDescForMain?: string
  video?: string
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    title?: string
    content?: string
    projectDescForMain?: string
  }>
}

/** 获取项目列表（不包含 projectDescription 字段） */
export function fetchProject(
  options: FetchProjectOptions = {},
): Promise<DirectusListResponse<ProjectRecord>> {
  const params = {
    fields: 'id,type,title,content,video,projectDescForMain,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/project', params, options)
}

export type FetchJoinUsOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface JoinUsStepRecord {
  stepTitle?: string
  /** translations 中部分条目字段名为 stepsTitle */
  stepsTitle?: string
  stepDescription?: string
}

export interface JoinUsTipRecord {
  tipValue?: string
}

export interface JoinUsRecord {
  [key: string]: unknown
  id?: number | string
  joinDescription?: string
  vision?: string
  email?: string
  guideTitle?: string
  guideIntro?: string
  steps?: JoinUsStepRecord[]
  tips?: JoinUsTipRecord[]
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    joinDescription?: string
    vision?: string
    email?: string
    guideTitle?: string
    guideIntro?: string
    steps?: JoinUsStepRecord[]
    tips?: JoinUsTipRecord[]
  }>
}

/** 获取加入我们页面内容（含 translations，前端按语言切换） */
export async function fetchJoinUs(
  options: FetchJoinUsOptions = {},
): Promise<DirectusItemResponse<JoinUsRecord>> {
  const params = {
    fields:
      'id,joinDescription,vision,email,guideTitle,guideIntro,steps,tips,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/joinus', params, options)
}

export function clearJoinUsCache() {
  clearCacheByPathPrefix('/items/joinus')
}

export type FetchJobOpeningOptions = DirectusGetOptions & {
  status?: boolean | string
  limit?: number
  offset?: number
}

export interface JobOpeningRequirementRecord {
  value?: string
}

export interface JobOpeningRecord {
  [key: string]: unknown
  id: number | string
  status?: boolean | string
  title?: string
  type?: string
  research?: string
  requirements?: JobOpeningRequirementRecord[]
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    status?: boolean | string
    title?: string
    type?: string
    research?: string
    requirements?: JobOpeningRequirementRecord[]
  }>
}

/** 获取招聘岗位列表（含 translations，前端按语言切换） */
export async function fetchJobOpening(
  options: FetchJobOpeningOptions = {},
): Promise<DirectusListResponse<JobOpeningRecord>> {
  const params: Record<string, any> = {
    fields: 'id,status,title,type,research,requirements,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }

  if (options.status !== undefined) {
    params['filter[status][_eq]'] = options.status
  }

  return directusGet('/items/jobOpening', params, options)
}

export function clearJobOpeningCache() {
  clearCacheByPathPrefix('/items/jobOpening')
}

export type FetchContactUsOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface ContactUsRecord {
  [key: string]: unknown
  id?: number | string
  labName?: string
  copyright?: string
  address?: string
  email?: string
  github?: string
  WeChat_QR?: string | { id?: string; filename_disk?: string } | null
  tip?: string
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    labName?: string
    copyright?: string
    address?: string
    email?: string
    github?: string
    WeChat_QR?: string | { id?: string; filename_disk?: string } | null
    tip?: string
  }>
}

/** 获取页脚联系我们信息（含 translations，前端按语言切换） */
export async function fetchContactUs(
  options: FetchContactUsOptions = {},
): Promise<DirectusItemResponse<ContactUsRecord>> {
  const params = {
    fields:
      'id,labName,copyright,address,email,github,WeChat_QR,tip,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/contactUs', params, options)
}

export function clearContactUsCache() {
  clearCacheByPathPrefix('/items/contactUs')
}

export type FetchTeamHistoryMemberOptions = DirectusGetOptions & {
  limit?: number
  offset?: number
}

export interface TeamHistoryMemberRecord {
  [key: string]: unknown
  id: number | string
  assistant?: string
  history?: string
  translations?: Array<{
    [key: string]: unknown
    languages_code?: string
    assistant?: string
    history?: string
  }>
}

/** 获取历史团队成员（含 translations，history 为 Markdown，单条记录） */
export async function fetchTeamHistoryMember(
  options: FetchTeamHistoryMemberOptions = {},
): Promise<DirectusItemResponse<TeamHistoryMemberRecord>> {
  const params = {
    fields: 'id,history,assistant,translations.*',
    limit: options.limit ?? 100,
    offset: options.offset ?? 0,
  }
  return directusGet('/items/teamHistoryMember', params, options)
}

export function clearTeamHistoryMemberCache() {
  clearCacheByPathPrefix('/items/teamHistoryMember')
}