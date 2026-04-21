import { appointmentRows } from '../data/dashboardData'
import type { AppointmentRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const appointmentCrud: CrudMethods<AppointmentRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<AppointmentRow>('/appointments')
  : createInMemoryCrudService<AppointmentRow>(appointmentRows, (item) => item.code)

export const appointmentService = {
  ...appointmentCrud,
}
