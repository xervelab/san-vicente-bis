import { useEffect, useState } from 'react'
import type { ResidentRow } from '../../types/dashboard'

type ResidentFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ResidentRow) => Promise<void>
  /** When provided the form is in "Edit" mode and fields are pre-filled. */
  initialData?: ResidentRow | null
  isSubmitting?: boolean
}

type FormErrors = Partial<Record<keyof ResidentRow, string>>

const PUROK_OPTIONS = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6']
const STATUS_OPTIONS = ['Active', 'Inactive', 'Senior', 'Deceased', 'Transferred']

const emptyForm: ResidentRow = { name: '', age: 0, purok: '', status: 'Active' }

export function ResidentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: ResidentFormModalProps) {
  const isEditMode = Boolean(initialData)
  const [form, setForm] = useState<ResidentRow>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})

  // Reset form whenever the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setForm(initialData ?? emptyForm)
      setErrors({})
    }
  }, [isOpen, initialData])

  function validate(): FormErrors {
    const e: FormErrors = {}

    if (!form.name.trim()) {
      e.name = 'Name is required.'
    } else if (form.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters.'
    }

    if (!form.age || form.age <= 0) {
      e.age = 'Age must be a positive number.'
    } else if (form.age > 150) {
      e.age = 'Please enter a valid age.'
    }

    if (!form.purok) {
      e.purok = 'Purok is required.'
    }

    if (!form.status) {
      e.status = 'Status is required.'
    }

    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    await onSubmit({ ...form, name: form.name.trim() })
  }

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {isEditMode ? 'Edit Resident' : 'Add Resident'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Name */}
          <div>
            <label
              htmlFor="resident-name"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="resident-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Juan Dela Cruz"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.name
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="resident-age"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Age <span className="text-rose-500">*</span>
            </label>
            <input
              id="resident-age"
              type="number"
              min={1}
              max={150}
              value={form.age || ''}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              placeholder="e.g. 25"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.age
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            />
            {errors.age && <p className="mt-1 text-xs text-rose-500">{errors.age}</p>}
          </div>

          {/* Purok */}
          <div>
            <label
              htmlFor="resident-purok"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Purok <span className="text-rose-500">*</span>
            </label>
            <select
              id="resident-purok"
              value={form.purok}
              onChange={(e) => setForm({ ...form, purok: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.purok
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            >
              <option value="">Select Purok</option>
              {PUROK_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.purok && <p className="mt-1 text-xs text-rose-500">{errors.purok}</p>}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="resident-status"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="resident-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.status
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-xs text-rose-500">{errors.status}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isEditMode ? 'Save Changes' : 'Add Resident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
