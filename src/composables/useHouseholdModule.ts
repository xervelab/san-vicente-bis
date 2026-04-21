import { useCrudModule } from './shared/useCrudModule'
import { householdService } from '../services/householdService'

export function useHouseholdModule() {
  return useCrudModule(householdService)
}
