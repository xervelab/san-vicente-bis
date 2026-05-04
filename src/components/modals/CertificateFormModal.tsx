import { useEffect, useState } from 'react'
import type { CertificateRow } from '../../types/dashboard'

type CertificateFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CertificateRow) => Promise<void>
  /** When provided the form is in "Edit" mode and fields are pre-filled. */
  initialData?: CertificateRow | null
  isSubmitting?: boolean
  /** List of resident names for the resident picker. */
  residentNames?: string[]
}

type FormErrors = Partial<Record<keyof CertificateRow, string>>

const CERTIFICATE_TYPES = [
  'Barangay Clearance',
  'Indigency',
  'Residency',
  'Business Permit Endorsement',
  'Good Moral',
  'Certificate of No Income',
]

const emptyForm: CertificateRow = { type: '', resident: '', date: '', status: 'Processing' }

export function CertificateFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  residentNames = [],
}: CertificateFormModalProps) {
  const isEditMode = Boolean(initialData)
  const [form, setForm] = useState<CertificateRow>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [residentSearch, setResidentSearch] = useState('')
  const [isResidentDropdownOpen, setIsResidentDropdownOpen] = useState(false)

  // Reset form whenever the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      const initial = initialData ?? { ...emptyForm, date: new Date().toISOString().slice(0, 10) }
      setForm(initial)
      setResidentSearch(initial.resident)
      setErrors({})
      setIsResidentDropdownOpen(false)
    }
  }, [isOpen, initialData])

  const filteredResidents = residentNames.filter((name) =>
    name.toLowerCase().includes(residentSearch.toLowerCase()),
  )

  function validate(): FormErrors {
    const e: FormErrors = {}

    if (!form.type) {
      e.type = 'Certificate type is required.'
    }

    if (!form.resident.trim()) {
      e.resident = 'Resident name is required.'
    }

    if (!form.date) {
      e.date = 'Date is required.'
    }

    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    await onSubmit({ ...form, resident: form.resident.trim() })
  }

  function selectResident(name: string) {
    setForm({ ...form, resident: name })
    setResidentSearch(name)
    setIsResidentDropdownOpen(false)
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
            {isEditMode ? 'Edit Certificate' : 'Issue Certificate'}
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
          {/* Certificate Type */}
          <div>
            <label
              htmlFor="cert-type"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Certificate Type <span className="text-rose-500">*</span>
            </label>
            <select
              id="cert-type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.type
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            >
              <option value="">Select type</option>
              {CERTIFICATE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-xs text-rose-500">{errors.type}</p>}
          </div>

          {/* Resident Picker */}
          <div className="relative">
            <label
              htmlFor="cert-resident"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Resident <span className="text-rose-500">*</span>
            </label>
            <input
              id="cert-resident"
              type="text"
              value={residentSearch}
              onChange={(e) => {
                setResidentSearch(e.target.value)
                setForm({ ...form, resident: e.target.value })
                setIsResidentDropdownOpen(true)
              }}
              onFocus={() => setIsResidentDropdownOpen(true)}
              onBlur={() => {
                // Delay to allow click on dropdown item
                window.setTimeout(() => setIsResidentDropdownOpen(false), 200)
              }}
              placeholder="Search or type resident name…"
              autoComplete="off"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.resident
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            />
            {/* Dropdown suggestions */}
            {isResidentDropdownOpen && filteredResidents.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700">
                {filteredResidents.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onMouseDown={() => selectResident(name)}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.resident && <p className="mt-1 text-xs text-rose-500">{errors.resident}</p>}
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="cert-date"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Date Requested <span className="text-rose-500">*</span>
            </label>
            <input
              id="cert-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                ${
                  errors.date
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-300'
                    : 'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
                }`}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
          </div>

          {/* Status (visible in edit mode) */}
          {isEditMode && (
            <div>
              <label
                htmlFor="cert-status"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Status
              </label>
              <input
                id="cert-status"
                type="text"
                value={form.status}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
              />
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Use the status action buttons in the table to change status.
              </p>
            </div>
          )}

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
              {isEditMode ? 'Save Changes' : 'Issue Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
