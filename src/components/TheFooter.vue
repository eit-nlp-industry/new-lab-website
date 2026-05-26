<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@/composables/useLocale'
import { labName } from '@/constants/nav'

const { t } = useLocale()

const year = new Date().getFullYear()

const email = 'join@iilab.example.edu'
const githubUrl = 'https://github.com/'
const scholarUrl = 'https://scholar.google.com/'

const address = computed(() =>
  t({
    zh: '北京市海淀区 XX 大学 XX 楼 XXX 室',
    en: 'Room XXX, XX Building, XX University, Haidian District, Beijing',
  }),
)

const copyright = computed(() =>
  t({
    zh: `© ${year} ${t(labName)}。保留所有权利。`,
    en: `© ${year} ${t(labName)}. All Rights Reserved.`,
  }),
)

const toastOpen = ref(false)
const toastText = ref('')
let toastTimer: number | undefined

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
  const ok = await copyToClipboard(email)
  showToast(
    ok
      ? t({ zh: '邮箱已复制', en: 'Email Copied!' })
      : t({ zh: '复制失败，请手动复制', en: 'Copy failed, please copy manually' }),
  )
}
</script>

<template>
  <footer class="mt-16 border-t border-slate-200/80 bg-slate-950 text-slate-300">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-10 text-center md:flex-row md:items-start md:text-left">
        <div class="max-w-xl">
          <p class="text-lg font-semibold tracking-tight text-white">
            {{ t(labName) }}
          </p>
          <p class="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            {{ copyright }}
          </p>
          <p class="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
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

            <!-- WeChat (hover popover) -->
            <div class="group relative">
              <button
                type="button"
                class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                :aria-label="t({ zh: '微信公众号二维码', en: 'WeChat QR' })"
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
                class="pointer-events-none absolute bottom-full left-1/2 mb-4 w-52 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
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
                    aria-hidden="true"
                  >
                    <div class="h-28 w-28 rounded-lg bg-[linear-gradient(rgba(6,182,212,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.10)_1px,transparent_1px)] bg-[size:12px_12px]">
                      <div class="flex h-full w-full items-center justify-center">
                        <span class="font-mono text-[10px] font-semibold text-cyan-200/80">QR</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mx-auto mt-2 h-2 w-2 rotate-45 border border-white/10 bg-slate-950/95" />
              </div>
            </div>

            <!-- Google Scholar -->
            <a
              :href="scholarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              aria-label="Google Scholar"
            >
              <svg class="h-5 w-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3 2.5 8l9.5 5 9.5-5L12 3Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.5 10.5V15c0 2.9 2.46 5.25 5.5 5.25S17.5 17.9 17.5 15v-4.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </a>
          </div>

          <p class="text-sm text-slate-500 sm:text-base">
            {{ t({ zh: '点击邮箱图标可复制地址', en: 'Click the email icon to copy the address' }) }}
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

