import { useCrudModule } from './shared/useCrudModule'
import { blotterService } from '../services/blotterService'

export function useBlotterModule() {
  return useCrudModule(blotterService)
}
