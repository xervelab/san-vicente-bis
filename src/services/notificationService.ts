import { notificationRows } from '../data/dashboardData'
import type { NotificationRow } from '../types/dashboard'
import { createInMemoryCrudService } from './shared/inMemoryCrud'

const notificationCrud = createInMemoryCrudService<NotificationRow>(
  notificationRows,
  (item) => `${item.channel}-${item.recipient}`,
)

export const notificationService = {
  ...notificationCrud,
  async sendNotification(payload: NotificationRow) {
    return notificationCrud.create(payload)
  },
}
