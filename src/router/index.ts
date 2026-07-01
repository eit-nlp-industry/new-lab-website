import { createRouter, createWebHashHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const PublicationsView = () => import('@/views/PublicationsView.vue')
const TeamView = () => import('@/views/TeamView.vue')
const NewsView = () => import('@/views/NewsView.vue')
const NewsDetailView = () => import('@/views/NewsDetailView.vue')
const ProjectsView = () => import('@/views/ProjectsView.vue')
const JoinUsView = () => import('@/views/JoinUsView.vue')

const routeLoaders = new Map<string, () => Promise<unknown>>([
  ['/', HomeView],
  ['/publications', PublicationsView],
  ['/team', TeamView],
  ['/news', NewsView],
  ['/news/:id', NewsDetailView],
  ['/projects', ProjectsView],
  ['/join', JoinUsView],
])

const preloadedPaths = new Set<string>()

export function preloadRouteComponent(path: string) {
  const loader = routeLoaders.get(path)
  if (!loader || preloadedPaths.has(path)) {
    return
  }

  preloadedPaths.add(path)
  void loader()
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/publications',
      name: 'publications',
      component: PublicationsView,
    },
    {
      path: '/team',
      name: 'team',
      component: TeamView,
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView,
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: NewsDetailView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/join',
      name: 'join',
      component: JoinUsView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
