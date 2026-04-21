import { useCrudModule } from './shared/useCrudModule'
import { onlineRequestService } from '../services/onlineRequestService'

export function useOnlineRequestsModule() {
  return useCrudModule(onlineRequestService)
}
