import { useCallback, useState } from 'react'
import { useCrudModule } from './shared/useCrudModule'
import { userService } from '../services/userService'
import type { UserRow } from '../types/dashboard'

export function useUsersModule() {
  const crud = useCrudModule(userService)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Activate a user (set status to 'Active'). */
  const activateUser = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { status: 'Active' })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Deactivate a user (set status to 'Inactive'). */
  const deactivateUser = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { status: 'Inactive' })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  return {
    ...crud,
    isSubmitting,
    activateUser,
    deactivateUser,
  }
}
