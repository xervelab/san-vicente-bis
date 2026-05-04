import { useCallback, useState } from 'react'
import { useCrudModule } from './shared/useCrudModule'
import { notificationService } from '../services/notificationService'
import type { NotificationRow } from '../types/dashboard'

export function useNotificationsModule() {
  const crud = useCrudModule(notificationService)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Send a new notification via the service. */
  const sendNotification = useCallback(
    async (payload: NotificationRow) => {
      setIsSubmitting(true)
      try {
        const sent = await notificationService.sendNotification(payload)
        await crud.loadData()
        return sent
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Mark a notification as read. */
  const markAsRead = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { isRead: true })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Dismiss/delete a notification. */
  const dismissNotification = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const deleted = await crud.deleteItem(id)
        return deleted
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  return {
    ...crud,
    isSubmitting,
    sendNotification,
    markAsRead,
    dismissNotification,
  }
}
