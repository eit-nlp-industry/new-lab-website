/** 将 CMS 中的链接规范为可直接跳转的外部 URL */
export function normalizeExternalUrl(raw: unknown): string {
  const link = String(raw ?? '').trim()
  if (!link) return ''

  const embeddedUrls = [...link.matchAll(/https?:\/\/[^\s"'<>]+/gi)].map((match) => match[0])
  if (embeddedUrls.length === 1 && link !== embeddedUrls[0] && link.includes(embeddedUrls[0])) {
    return embeddedUrls[0]
  }
  if (embeddedUrls.length > 1) {
    return embeddedUrls[embeddedUrls.length - 1]
  }

  if (/^https?:\/\//i.test(link)) return link
  if (link.startsWith('//')) return `https:${link}`
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return link
  if (link.startsWith('/')) return link

  return `https://${link}`
}
