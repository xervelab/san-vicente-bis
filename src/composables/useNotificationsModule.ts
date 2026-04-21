import { useCrudModule } from './shared/useCrudModule'
import { notificationService } from '../services/notificationService'

export function useNotificationsModule() {
  return useCrudModule(notificationService)
}
