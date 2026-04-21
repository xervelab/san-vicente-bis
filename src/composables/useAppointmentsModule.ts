import { useCrudModule } from './shared/useCrudModule'
import { appointmentService } from '../services/appointmentService'

export function useAppointmentsModule() {
  return useCrudModule(appointmentService)
}
