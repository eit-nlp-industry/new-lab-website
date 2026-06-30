import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initAnalytics, trackPageView } from './utils/analytics'
import './style.css'

const app = createApp(App)

initAnalytics()

router.afterEach((to) => {
  trackPageView(to.fullPath)
})

router.isReady().then(() => {
  trackPageView(router.currentRoute.value.fullPath)
})

app.use(createPinia())
app.use(router)
app.mount('#app')
