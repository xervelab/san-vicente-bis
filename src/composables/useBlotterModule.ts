import { useCallback, useState } from 'react'
import { useCrudModule } from './shared/useCrudModule'
import { blotterService } from '../services/blotterService'
import type { BlotterRow, BlotterStatus } from '../types/dashboard'

/**
 * Valid status transitions for the blotter workflow:
 * Filed → Under Investigation → Resolved | Dismissed
 */
export const BLOTTER_STATUS_FLOW: Record<BlotterStatus, BlotterStatus[]> = {
  Filed: ['Under Investigation'],
  'Under Investigation': ['Resolved', 'Dismissed'],
  Resolved: [],
  Dismissed: [],
}

export function useBlotterModule() {
  const crud = useCrudModule(blotterService)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** File a new blotter record (status defaults to "Filed"). */
  const fileBlotter = useCallback(
    async (payload: BlotterRow) => {
      setIsSubmitting(true)
      try {
        const record: BlotterRow = { ...payload, status: 'Filed' }
        const created = await crud.createItem(record)
        return created
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Transition an existing blotter record to the next status in the workflow. */
  const advanceStatus = useCallback(
    async (code: string, nextStatus: BlotterStatus) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(code, { status: nextStatus })
        return updated
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Get valid next statuses for a given current status. */
  function getNextStatuses(currentStatus: BlotterStatus): BlotterStatus[] {
    return BLOTTER_STATUS_FLOW[currentStatus] ?? []
  }

  return {
    ...crud,
    isSubmitting,
    fileBlotter,
    advanceStatus,
    getNextStatuses,
  }
}
