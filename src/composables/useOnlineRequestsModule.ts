import { useCallback, useState } from 'react'
import { useCrudModule } from './shared/useCrudModule'
import { onlineRequestService } from '../services/onlineRequestService'
import type { RequestStatus } from '../types/dashboard'

export function useOnlineRequestsModule() {
  const crud = useCrudModule(onlineRequestService)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Approve a request (set status to 'Approved'). */
  const approveRequest = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { status: 'Approved' })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Reject a request (set status to 'Rejected'). */
  const rejectRequest = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { status: 'Rejected' })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Complete a request (set status to 'Released'). */
  const completeRequest = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { status: 'Released' })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Update request status to any valid status. */
  const updateStatus = useCallback(
    async (id: string, status: RequestStatus) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(id, { status })
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
    approveRequest,
    rejectRequest,
    completeRequest,
    updateStatus,
  }
}
