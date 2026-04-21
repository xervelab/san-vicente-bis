import { useCrudModule } from './shared/useCrudModule'
import { residentService } from '../services/residentService'

export function useResidentModule() {
  return useCrudModule(residentService)
}
