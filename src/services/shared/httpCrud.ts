import type { CrudMethods, Identifier } from './inMemoryCrud'
import { httpClient } from './httpClient'

const safeId = (id: Identifier) => encodeURIComponent(id)

export function createHttpCrudService<T>(resourcePath: string): CrudMethods<T> {
  return {
    getAll() {
      return httpClient.get<T[]>(resourcePath)
    },
    getById(id) {
      return httpClient.get<T>(`${resourcePath}/${safeId(id)}`)
    },
    create(payload) {
      return httpClient.post<T>(resourcePath, payload)
    },
    update(id, payload) {
      return httpClient.patch<T>(`${resourcePath}/${safeId(id)}`, payload)
    },
    async remove(id) {
      await httpClient.delete(`${resourcePath}/${safeId(id)}`)
      return true
    },
    async reset() {
      return Promise.resolve()
    },
  }
}