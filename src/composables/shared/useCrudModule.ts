import { useCallback, useEffect, useState } from 'react'

type CrudApi<T> = {
  getAll: () => Promise<T[]>
  create: (payload: T) => Promise<T>
  update: (id: string, payload: Partial<T>) => Promise<T | null>
  remove: (id: string) => Promise<boolean>
}

export function useCrudModule<T>(service: CrudApi<T>) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const results = await service.getAll()
      setItems(results)
    } catch {
      setError('Failed to load module data.')
    } finally {
      setIsLoading(false)
    }
  }, [service])

  const createItem = useCallback(
    async (payload: T) => {
      const created = await service.create(payload)
      await loadData()
      return created
    },
    [loadData, service],
  )

  const updateItem = useCallback(
    async (id: string, payload: Partial<T>) => {
      const updated = await service.update(id, payload)
      await loadData()
      return updated
    },
    [loadData, service],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      const removed = await service.remove(id)
      await loadData()
      return removed
    },
    [loadData, service],
  )

  useEffect(() => {
    void loadData()
  }, [loadData])

  return {
    items,
    isLoading,
    error,
    loadData,
    createItem,
    updateItem,
    deleteItem,
  }
}
