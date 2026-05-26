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

export function directusAssetUrl(fileRef: any, params: Record<string, any> = {}) {
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

  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === '') continue
    qs.set(k, String(v))
  }
  const query = qs.toString()
  return `${base}${assetPath}${query ? `?${query}` : ''}`
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
  console.log('✅ 论文数据请求成功!', data)
  return data
}

export function clearAllDirectusCache() {
  requestCache.clear()
  pendingRequestCache.clear()
}

export function clearIntruduceCache() {
  clearCacheByPathPrefix('/items/intruduce')
}

