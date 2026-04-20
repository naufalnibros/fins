import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/pre-wedding',
  },
  {
    path: '/pre-wedding',
    name: 'pre-wedding',
    component: () => import('@/views/PreWeddingView.vue'),
    meta: { title: 'Pre-Wedding' },
  },
  {
    path: '/wedding-day',
    name: 'wedding-day',
    component: () => import('@/views/WeddingDayView.vue'),
    meta: { title: 'Hari-H' },
  },
  {
    path: '/post-wedding',
    name: 'post-wedding',
    component: () => import('@/views/PostWeddingView.vue'),
    meta: { title: 'Post-Wedding' },
  },
]

const router = createRouter({
  // Hash mode wajib untuk GitHub Pages
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Update judul halaman sesuai route
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} — Budgetin Wedding` : 'Budgetin Wedding'
})

export default router
