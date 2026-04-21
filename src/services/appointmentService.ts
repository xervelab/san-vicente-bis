import { appointmentRows } from '../data/dashboardData'
import type { AppointmentRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const appointmentCrud = createInMemoryCrudService<AppointmentRow>(appointmentRows, (item) => item.code)

export const appointmentService = {
  ...appointmentCrud,
}
