<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const { notifications, remove } = useNotification()

type NavItem = { name: string; path: string; icon: string; label: string }
const navItems: NavItem[] = [
  { name: 'pre-wedding', path: '/pre-wedding', icon: '💍', label: 'Pre-Wedding' },
  { name: 'wedding-day', path: '/wedding-day', icon: '🎊', label: 'Hari-H' },
  { name: 'post-wedding', path: '/post-wedding', icon: '🏠', label: 'Post-Wedding' },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Router View -->
    <main>
      <RouterView />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
      <div class="max-w-2xl mx-auto flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex-1 flex flex-col items-center py-2 px-1 gap-0.5 transition-colors"
          :class="isActive(item.path) ? 'text-purple-700' : 'text-gray-400 hover:text-gray-600'"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-xs font-medium">{{ item.label }}</span>
          <span
            v-if="isActive(item.path)"
            class="w-1 h-1 rounded-full bg-purple-600"
          />
        </RouterLink>
      </div>
    </nav>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-72 flex gap-3"
        >
          <span class="text-xl shrink-0">
            {{ notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : notification.type === 'warning' ? '⚠️' : 'ℹ️' }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 text-sm">{{ notification.title }}</p>
            <p v-if="notification.message" class="text-xs text-gray-500 mt-0.5">{{ notification.message }}</p>
          </div>
          <button class="text-gray-300 hover:text-gray-500 shrink-0" @click="remove(notification.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
