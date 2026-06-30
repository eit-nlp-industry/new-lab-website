<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { directusPublicAssetUrl, fetchContactUs, type ContactUsRecord } from '@/api/directus'
import { useLocale } from '@/composables/useLocale'
import { labName as defaultLabName } from '@/constants/nav'
import { getTranslatedField } from '@/utils/translation'
import { normalizeExternalUrl } from '@/utils/url'

const { t, locale } = useLocale()
const contactUs = ref<ContactUsRecord | null>(null)

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)
  try {
    const res = await fetchContactUs()
    contactUs.value = res.data ?? null
  } catch (e) {
    console.error('[TheFooter] fetchContactUs failed:', e)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

const footerLabName = computed(
  () => getTranslatedField(contactUs.value, 'labName', locale.value) || t(defaultLabName),
)

const copyright = computed(() => getTranslatedField(contactUs.value, 'copyright', locale.value))

const address = computed(() => getTranslatedField(contactUs.value, 'address', locale.value))

const email = computed(() => getTranslatedField(contactUs.value, 'email', locale.value))

const githubUrl = computed(() => normalizeExternalUrl(getTranslatedField(contactUs.value, 'github', locale.value)))

const redNoteUrl = computed(() =>
  normalizeExternalUrl(getTranslatedField(contactUs.value, 'red_note', locale.value)),
)

const contactTip = computed(() => getTranslatedField(contactUs.value, 'tip', locale.value))

const weChatQrUrl = computed(() => {
  const qr = contactUs.value?.WeChat_QR
  return qr ? directusPublicAssetUrl(qr) : ''
})

const redNoteQrUrl = computed(() => {
  const qr = contactUs.value?.red_note_QR
  return qr ? directusPublicAssetUrl(qr) : ''
})

const toastOpen = ref(false)
const toastText = ref('')
const weChatPopoverOpen = ref(false)
const weChatPopoverRef = ref<HTMLElement | null>(null)
let toastTimer: number | undefined

function toggleWeChatPopover() {
  weChatPopoverOpen.value = !weChatPopoverOpen.value
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null
  if (!target) return
  if (!weChatPopoverRef.value?.contains(target)) {
    weChatPopoverOpen.value = false
  }
}

function showToast(message: string) {
  toastText.value = message
  toastOpen.value = true
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastOpen.value = false
  }, 1600)
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', 'true')
      ta.style.position = 'fixed'
      ta.style.top = '0'
      ta.style.left = '0'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

async function onEmailClick() {
  if (!email.value) return
  const ok = await copyToClipboard(email.value)
  showToast(
    ok
      ? t({ zh: '邮箱已复制', en: 'Email Copied!' })
      : t({ zh: '复制失败，请手动复制', en: 'Copy failed, please copy manually' }),
  )
}
</script>

<template>
  <footer class="mt-16 border-t border-slate-200/80 bg-slate-950 text-slate-300">
    <div class="site-container py-12">
      <div class="flex flex-col items-center justify-between gap-10 text-center md:flex-row md:items-start md:text-left">
        <div class="max-w-xl">
          <p class="text-lg font-semibold tracking-tight text-white">
            {{ footerLabName }}
          </p>
          <p v-if="copyright" class="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            {{ copyright }}
          </p>
          <p v-if="address" class="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
            {{ address }}
          </p>
        </div>

        <div class="flex flex-col items-center gap-4 md:items-end">
          <p class="font-mono text-xs font-medium tracking-widest text-cyan-300/90 uppercase">
            {{ t({ zh: '联系与学术社交', en: 'Connect' }) }}
          </p>

          <div class="flex items-center gap-3">
            <!-- Email (copy + toast) -->
            <button
              v-if="email"
              type="button"
              class="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              :aria-label="t({ zh: '复制邮箱', en: 'Copy email' })"
              @click="onEmailClick"
            >
              <svg class="h-5 w-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M5.5 7.5 12 12l6.5-4.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- GitHub -->
            <a
              v-if="githubUrl"
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              aria-label="GitHub"
            >
              <svg class="h-5 w-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.596 2 12.26c0 4.53 2.865 8.375 6.838 9.73.5.096.682-.222.682-.493 0-.244-.009-.892-.014-1.75-2.782.619-3.37-1.377-3.37-1.377-.454-1.19-1.11-1.506-1.11-1.506-.908-.64.069-.627.069-.627 1.004.073 1.532 1.058 1.532 1.058.892 1.567 2.341 1.114 2.91.852.09-.67.349-1.114.635-1.37-2.22-.263-4.555-1.14-4.555-5.07 0-1.12.39-2.035 1.03-2.753-.103-.262-.447-1.319.098-2.75 0 0 .84-.276 2.75 1.052A9.2 9.2 0 0 1 12 7.287c.85.004 1.705.118 2.504.346 1.909-1.328 2.748-1.052 2.748-1.052.546 1.431.202 2.488.1 2.75.64.718 1.028 1.633 1.028 2.753 0 3.94-2.339 4.803-4.566 5.06.359.318.678.945.678 1.905 0 1.375-.012 2.483-.012 2.82 0 .274.18.595.688.494C19.138 20.633 22 16.79 22 12.26 22 6.596 17.523 2 12 2Z"
                />
              </svg>
            </a>

            <!-- Xiaohongshu (RED) -->
            <div
              v-if="redNoteUrl || redNoteQrUrl"
              class="relative"
              :class="{ group: redNoteQrUrl }"
            >
              <a
                v-if="redNoteUrl"
                :href="redNoteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="group/icon inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                :aria-label="t({ zh: '小红书', en: 'Xiaohongshu' })"
              >
                <svg class="h-5 w-5 transition-transform group-hover/icon:scale-105" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M7.2 3.456h9.6c.99 0 1.8.81 1.8 1.8v13.488c0 .99-.81 1.8-1.8 1.8H7.2c-.99 0-1.8-.81-1.8-1.8V5.256c0-.99.81-1.8 1.8-1.8zm2.304 3.6c.662 0 1.2.538 1.2 1.2v.72h3.792v-.72c0-.662.538-1.2 1.2-1.2h.504c.662 0 1.2.538 1.2 1.2v8.688c0 .662-.538 1.2-1.2 1.2h-.504c-.662 0-1.2-.538-1.2-1.2v-.72H10.704v.72c0 .662-.538 1.2-1.2 1.2H9c-.662 0-1.2-.538-1.2-1.2V8.256c0-.662.538-1.2 1.2-1.2h.504z"
                  />
                </svg>
              </a>
              <span
                v-else
                class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300"
                :aria-label="t({ zh: '小红书二维码', en: 'Xiaohongshu QR' })"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M7.2 3.456h9.6c.99 0 1.8.81 1.8 1.8v13.488c0 .99-.81 1.8-1.8 1.8H7.2c-.99 0-1.8-.81-1.8-1.8V5.256c0-.99.81-1.8 1.8-1.8zm2.304 3.6c.662 0 1.2.538 1.2 1.2v.72h3.792v-.72c0-.662.538-1.2 1.2-1.2h.504c.662 0 1.2.538 1.2 1.2v8.688c0 .662-.538 1.2-1.2 1.2h-.504c-.662 0-1.2-.538-1.2-1.2v-.72H10.704v.72c0 .662-.538 1.2-1.2 1.2H9c-.662 0-1.2-.538-1.2-1.2V8.256c0-.662.538-1.2 1.2-1.2h.504z"
                  />
                </svg>
              </span>

              <div
                v-if="redNoteQrUrl"
                class="pointer-events-none absolute bottom-full left-1/2 mb-4 w-64 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
              >
                <div class="rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur">
                  <div class="mb-3 flex items-center justify-between">
                    <p class="font-mono text-xs font-medium tracking-widest text-cyan-300/90 uppercase">
                      {{ t({ zh: '小红书', en: 'Xiaohongshu' }) }}
                    </p>
                    <span class="text-xs text-slate-500">{{ t({ zh: '扫码关注', en: 'Scan to follow' }) }}</span>
                  </div>
                  <div class="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-4">
                    <img
                      :src="redNoteQrUrl"
                      :alt="t({ zh: '小红书二维码', en: 'Xiaohongshu QR code' })"
                      class="h-40 w-40 rounded-lg object-contain sm:h-44 sm:w-44"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="mx-auto mt-2 h-2 w-2 rotate-45 border border-white/10 bg-slate-950/95" />
              </div>
            </div>

            <!-- WeChat (hover popover) -->
            <div v-if="weChatQrUrl" ref="weChatPopoverRef" class="group relative">
              <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                :aria-label="t({ zh: '微信公众号二维码', en: 'WeChat QR' })"
                @click="toggleWeChatPopover"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M8 10.5c.828 0 1.5-.504 1.5-1.125S8.828 8.25 8 8.25s-1.5.504-1.5 1.125S7.172 10.5 8 10.5Zm8 0c.828 0 1.5-.504 1.5-1.125S16.828 8.25 16 8.25s-1.5.504-1.5 1.125S15.172 10.5 16 10.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 3c-5.247 0-9.5 3.582-9.5 8 0 2.644 1.553 4.988 3.965 6.43L5.5 21l4.038-2.02c.8.14 1.63.215 2.462.215 5.247 0 9.5-3.582 9.5-8S17.247 3 12 3Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <div
                class="pointer-events-none absolute bottom-full left-1/2 mb-4 w-64 -translate-x-1/2 transition-all duration-200"
                :class="weChatPopoverOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'"
              >
                <div class="rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur">
                  <div class="mb-3 flex items-center justify-between">
                    <p class="font-mono text-xs font-medium tracking-widest text-cyan-300/90 uppercase">
                      {{ t({ zh: '微信公众号', en: 'WeChat' }) }}
                    </p>
                    <span class="text-xs text-slate-500">{{ t({ zh: '扫码关注', en: 'Scan to follow' }) }}</span>
                  </div>
                  <div
                    class="grid place-items-center rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <img
                      :src="weChatQrUrl"
                      :alt="t({ zh: '微信公众号二维码', en: 'WeChat QR code' })"
                      class="h-40 w-40 rounded-lg object-contain sm:h-44 sm:w-44"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="mx-auto mt-2 h-2 w-2 rotate-45 border border-white/10 bg-slate-950/95" />
              </div>
            </div>
          </div>

          <p v-if="contactTip" class="text-sm text-slate-500 sm:text-base">
            {{ contactTip }}
          </p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      class="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        class="rounded-full border border-white/10 bg-slate-950/90 px-4 py-2.5 text-sm font-medium text-white shadow-2xl shadow-black/40 backdrop-blur transition-all duration-200"
        :class="toastOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'"
      >
        {{ toastText }}
      </div>
    </div>
  </footer>
</template>
