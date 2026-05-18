import { useCallback, useState } from 'react'
import { useCrudModule } from './shared/useCrudModule'
import { appointmentService } from '../services/appointmentService'
import type { AppointmentRow, AppointmentStatus } from '../types/dashboard'

export function useAppointmentsModule() {
  const crud = useCrudModule(appointmentService)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** Schedule a new appointment with Pending status. */
  const scheduleAppointment = useCallback(
    async (payload: AppointmentRow) => {
      setIsSubmitting(true)
      try {
        const appointment: AppointmentRow = { ...payload, status: 'Pending' }
        const created = await crud.createItem(appointment)
        return created
      } finally {
        setIsSubmitting(false)
      }
    },
    [crud],
  )

  /** Update appointment status. */
  const updateStatus = useCallback(
    async (code: string, status: AppointmentStatus) => {
      setIsSubmitting(true)
      try {
        const updated = await crud.updateItem(code, { status })
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
    scheduleAppointment,
    updateStatus,
  }
}
