const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

declare global {
  interface Window {
    dataLayer: IArguments[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false
let lastTrackedPath = ''

function isAnalyticsEnabled() {
  return Boolean(measurementId)
}

export function initAnalytics() {
  if (!isAnalyticsEnabled() || initialized) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false,
    debug_mode: import.meta.env.DEV,
  })

  initialized = true
}

export function trackPageView(path?: string) {
  if (!isAnalyticsEnabled() || !window.gtag) {
    return
  }

  const pagePath = path || `${window.location.pathname}${window.location.search}`
  if (pagePath === lastTrackedPath) {
    return
  }

  window.gtag('event', 'page_view', {
    send_to: measurementId,
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  })

  lastTrackedPath = pagePath
}
