import { useCrudModule } from './shared/useCrudModule'
import { userService } from '../services/userService'

export function useUsersModule() {
  return useCrudModule(userService)
}
