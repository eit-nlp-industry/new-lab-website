<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { preloadRouteComponent } from '@/router'
import LangSwitch from '@/components/common/LangSwitch.vue'
import TheFooter from '@/components/TheFooter.vue'
import { labName, navLinks } from '@/constants/nav'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const { t } = useLocale()
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function preloadNavRoute(path: string) {
  preloadRouteComponent(path)
}

onMounted(() => {
  window.setTimeout(() => {
    for (const item of navLinks) {
      if (item.path !== route.path) {
        preloadRouteComponent(item.path)
      }
    }
  }, 1200)
})

watch(() => route.path, closeMobileMenu)
</script>

<template>
  <div class="flex min-h-svh flex-col bg-white text-slate-800">
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div class="site-container flex h-[4.25rem] items-center justify-between gap-4">
        <RouterLink
          to="/"
          class="shrink-0 text-xl font-semibold tracking-tight text-cyan-700 transition-colors hover:text-cyan-900"
          @click="closeMobileMenu"
        >
          {{ t(labName) }}
        </RouterLink>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <RouterLink
            v-for="item in navLinks"
            :key="item.key"
            :to="item.path"
            class="rounded-md px-3 py-2 text-base font-medium transition-colors"
            :class="
              isActive(item.path)
                ? 'bg-cyan-50 text-cyan-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-900'
            "
            @mouseenter="preloadNavRoute(item.path)"
            @focus="preloadNavRoute(item.path)"
          >
            {{ t(item.label) }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-3">
          <LangSwitch />
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-cyan-900 md:hidden"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            @click="toggleMobileMenu"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        v-show="mobileMenuOpen"
        id="mobile-menu"
        class="border-t border-slate-200 bg-white md:hidden"
        aria-label="Mobile navigation"
      >
        <div class="site-container space-y-1 py-3">
          <RouterLink
            v-for="item in navLinks"
            :key="item.key"
            :to="item.path"
            class="block rounded-md px-3 py-3 text-base font-medium transition-colors"
            :class="
              isActive(item.path)
                ? 'bg-cyan-50 text-cyan-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-900'
            "
            @touchstart="preloadNavRoute(item.path)"
            @click="closeMobileMenu"
          >
            {{ t(item.label) }}
          </RouterLink>
        </div>
      </nav>
    </header>

    <main class="site-container flex-1 py-8">
      <RouterView />
    </main>

    <TheFooter />
  </div>
</template>
