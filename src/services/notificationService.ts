import { notificationRows } from '../data/dashboardData'
import type { NotificationRow } from '../types/dashboard'
import { createHttpCrudService } from './shared/httpCrud'
import { httpClient } from './shared/httpClient'
import { createInMemoryCrudService, type CrudMethods } from './shared/inMemoryCrud'
import { USE_HTTP_SERVICES } from './shared/serviceConfig'

const notificationCrud: CrudMethods<NotificationRow> = USE_HTTP_SERVICES
  ? createHttpCrudService<NotificationRow>('/notifications')
  : createInMemoryCrudService<NotificationRow>(
      notificationRows,
      (item) => `${item.channel}-${item.recipient}`,
    )

export const notificationService = {
  ...notificationCrud,
  async sendNotification(payload: NotificationRow) {
    if (USE_HTTP_SERVICES) {
      return httpClient.post<NotificationRow>('/notifications/send', payload)
    }

    return notificationCrud.create(payload)
  },
}
