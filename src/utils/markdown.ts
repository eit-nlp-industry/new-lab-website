import { marked } from 'marked'
import { directusPublicAssetUrl } from '@/api/directus'

marked.setOptions({
  breaks: true,
  gfm: true,
})

const FILE_ID_RE =
  /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i

/** Directus WYSIWYG / 飞书粘贴的正文通常以块级标签开头。 */
const HTML_DOC_PATTERN =
  /^\s*<(?:!--|!doctype|html|body|div|p|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|figure|figcaption|section|article|blockquote|pre|hr|img|video|iframe|br|span|strong|em|a|code)\b/i

export function renderMarkdown(source: string): string {
  const text = String(source ?? '').trim()
  if (!text) return ''
  return marked.parse(text, { async: false }) as string
}

export function looksLikeHtmlDocument(source: string): boolean {
  return HTML_DOC_PATTERN.test(String(source ?? ''))
}

export function decodeHtmlUrl(value: string): string {
  return String(value ?? '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .trim()
}

/** 从 Directus / 飞书粘贴地址里取出文件 UUID，去掉 .PNG 等后缀和旧主机。 */
export function extractDirectusFileId(value: string): string {
  const trimmed = decodeHtmlUrl(value).replace(/^<|>$/g, '')
  if (!trimmed) return ''

  const fromAssets = trimmed.match(/\/assets\/([^/?#\s"'<>]+)/i)
  const candidate = fromAssets?.[1] || trimmed.replace(/^\.\//, '').split(/[?#]/)[0]
  const matched = String(candidate).match(FILE_ID_RE)
  return matched?.[1]?.toLowerCase() ?? ''
}

/** 把正文里的文件 ID、旧主机 /assets/... 转成当前站点可访问的地址。 */
export function resolveMarkdownAsset(value: string): string {
  const trimmed = decodeHtmlUrl(value).replace(/^<|>$/g, '')
  if (
    !trimmed ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return value
  }

  const fileId = extractDirectusFileId(trimmed)
  if (fileId) {
    return directusPublicAssetUrl(fileId) || value
  }

  return value
}

function enhanceBlogHtml(html: string): string {
  const withAssets = html.replace(
    /\b(src|href|poster)=(["'])([^"']+)\2/gi,
    (match, attr: string, quote: string, raw: string) => {
      const decoded = decodeHtmlUrl(raw)
      const fileId = extractDirectusFileId(decoded)
      if (!fileId) return match

      const next = directusPublicAssetUrl(fileId)
      if (!next) return match

      const extras = [`data-asset-id=${quote}${fileId}${quote}`]
      if (decoded !== next) {
        extras.push(`data-original-src=${quote}${decoded}${quote}`)
      }

      return `${attr}=${quote}${next}${quote} ${extras.join(' ')}`
    },
  )

  return withAssets.replace(/<video\b([^>]*?)>/gi, (match, attrs: string) => {
    const extras = [
      /\bcontrols\b/i.test(attrs) ? '' : ' controls',
      /\bplaysinline\b/i.test(attrs) ? '' : ' playsinline',
    ]
      .filter(Boolean)
      .join('')
    if (!extras) return match
    return `<video${extras}${attrs}>`
  })
}

/** 渲染博客正文：兼容 Markdown、WYSIWYG HTML，以及飞书粘贴的旧资源地址。 */
export function renderBlogContent(source: string): string {
  const text = String(source ?? '').trim()
  if (!text) return ''

  const html = looksLikeHtmlDocument(text) ? text : renderMarkdown(text)
  return enhanceBlogHtml(html)
}

/** @deprecated 使用 renderBlogContent；保留以免旧调用中断。 */
export function renderBlogMarkdown(source: string): string {
  return renderBlogContent(source)
}
