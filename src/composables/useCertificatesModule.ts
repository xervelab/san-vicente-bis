import { useCrudModule } from './shared/useCrudModule'
import { certificateService } from '../services/certificateService'

export function useCertificatesModule() {
  return useCrudModule(certificateService)
}
