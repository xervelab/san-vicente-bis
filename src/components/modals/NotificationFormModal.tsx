import { useEffect, useState } from 'react'
import type { NotificationRow } from '../../types/dashboard'

type NotificationFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NotificationRow) => Promise<void>
  isSubmitting?: boolean
}

type NotificationFormData = Omit<NotificationRow, 'id' | 'status' | 'isRead'>

type FormErrors = Partial<Record<keyof NotificationFormData, string>>

const CHANNEL_OPTIONS = ['SMS', 'Email']
const MESSAGE_TEMPLATES = [
  'Your Barangay Clearance is ready for pickup.',
  'Your certificate is approved and ready for claim.',
  'Please update your missing requirements.',
  'Appointment reminder for your scheduled service.',
  'Your online request has been approved.',
  'Action required: Please respond by next week.',
]

const emptyForm: NotificationFormData = {
  channel: 'SMS',
  recipient: '',
  message: '',
}

export function NotificationFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: NotificationFormModalProps) {
  const [form, setForm] = useState<NotificationFormData>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})

  // Reset form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setErrors({})
    }
  }, [isOpen])

  function validate(): FormErrors {
    const e: FormErrors = {}

    if (!form.channel) {
      e.channel = 'Channel is required.'
    }

    if (!form.recipient.trim()) {
      e.recipient = 'Recipient name is required.'
    } else if (form.recipient.trim().length < 2) {
      e.recipient = 'Name must be at least 2 characters.'
    }

    if (!form.message.trim()) {
      e.message = 'Message is required.'
    } else if (form.message.trim().length < 5) {
      e.message = 'Message must be at least 5 characters.'
    } else if (form.message.trim().length > 500) {
      e.message = 'Message cannot exceed 500 characters.'
    }

    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    const payload: NotificationRow = {
      id: `notif-${Date.now()}`,
      channel: form.channel as 'SMS' | 'Email',
      recipient: form.recipient.trim(),
      message: form.message.trim(),
      status: 'Sent',
      isRead: false,
    }

    await onSubmit(payload)
    setForm(emptyForm)
  }

  if (!isOpen) return null

  const inputBaseClass =
    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition'
  const inputNormalClass =
    'border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
  const inputErrorClass = 'border-rose-400 focus:ring-2 focus:ring-rose-300'

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
            Send Notification
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
          {/* Channel */}
          <div>
            <label
              htmlFor="notif-channel"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Channel <span className="text-rose-500">*</span>
            </label>
            <select
              id="notif-channel"
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value as 'SMS' | 'Email' })}
              className={`${inputBaseClass} ${errors.channel ? inputErrorClass : inputNormalClass}`}
            >
              <option value="">Select Channel</option>
              {CHANNEL_OPTIONS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
            {errors.channel && <p className="mt-1 text-xs text-rose-500">{errors.channel}</p>}
          </div>

          {/* Recipient */}
          <div>
            <label
              htmlFor="notif-recipient"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Recipient <span className="text-rose-500">*</span>
            </label>
            <input
              id="notif-recipient"
              type="text"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
              placeholder="e.g. Juan Dela Cruz"
              className={`${inputBaseClass} ${errors.recipient ? inputErrorClass : inputNormalClass}`}
            />
            {errors.recipient && <p className="mt-1 text-xs text-rose-500">{errors.recipient}</p>}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="notif-message"
              className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <span>
                Message <span className="text-rose-500">*</span>
              </span>
              <span className="text-xs text-slate-400">{form.message.length}/500</span>
            </label>
            <textarea
              id="notif-message"
              rows={4}
              maxLength={500}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Enter your notification message..."
              className={`${inputBaseClass} resize-none ${errors.message ? inputErrorClass : inputNormalClass}`}
            />
            {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}

            {/* Quick Templates */}
            <div className="mt-3">
              <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">Quick Templates:</p>
              <div className="flex flex-wrap gap-2">
                {MESSAGE_TEMPLATES.map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setForm({ ...form, message: template })}
                    className="rounded px-2 py-1 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition"
                  >
                    {template.substring(0, 20)}...
                  </button>
                ))}
              </div>
            </div>
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
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
