// Composable untuk notifikasi toast di seluruh aplikasi

import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration: number
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  function add(
    type: NotificationType,
    title: string,
    message: string,
    duration = 4000
  ): void {
    const id = crypto.randomUUID()
    notifications.value.push({ id, type, title, message, duration })

    // Otomatis hapus notifikasi setelah durasi
    setTimeout(() => remove(id), duration)
  }

  function remove(id: string): void {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  const success = (title: string, message = '') => add('success', title, message)
  const error = (title: string, message = '') => add('error', title, message)
  const warning = (title: string, message = '') => add('warning', title, message)
  const info = (title: string, message = '') => add('info', title, message)

  return { notifications, add, remove, success, error, warning, info }
}
