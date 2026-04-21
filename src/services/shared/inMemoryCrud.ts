export type Identifier = string

export type CrudMethods<T> = {
  getAll: () => Promise<T[]>
  getById: (id: Identifier) => Promise<T | undefined>
  create: (payload: T) => Promise<T>
  update: (id: Identifier, payload: Partial<T>) => Promise<T | null>
  remove: (id: Identifier) => Promise<boolean>
  reset: () => Promise<void>
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export function createInMemoryCrudService<T>(
  seedData: T[],
  getIdentifier: (item: T) => Identifier,
): CrudMethods<T> {
  const initialData = clone(seedData)
  let storage = clone(seedData)

  return {
    async getAll() {
      await wait(220)
      return clone(storage)
    },
    async getById(id) {
      await wait(180)
      return clone(storage.find((item) => getIdentifier(item) === id))
    },
    async create(payload) {
      await wait(260)
      storage = [...storage, clone(payload)]
      return clone(payload)
    },
    async update(id, payload) {
      await wait(260)
      const targetIndex = storage.findIndex((item) => getIdentifier(item) === id)

      if (targetIndex < 0) {
        return null
      }

      const updatedItem = {
        ...storage[targetIndex],
        ...clone(payload),
      }

      storage = [...storage.slice(0, targetIndex), updatedItem, ...storage.slice(targetIndex + 1)]
      return clone(updatedItem)
    },
    async remove(id) {
      await wait(240)
      const originalLength = storage.length
      storage = storage.filter((item) => getIdentifier(item) !== id)
      return storage.length < originalLength
    },
    async reset() {
      await wait(180)
      storage = clone(initialData)
    },
  }
}
