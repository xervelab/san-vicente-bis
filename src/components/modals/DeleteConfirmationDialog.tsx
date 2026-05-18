type DeleteConfirmationDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  /** Name or identifier shown in the dialog. */
  itemName: string
  /** Label shown in the dialog title, e.g. "Resident", "Household". Defaults to "Record". */
  itemLabel?: string
  isDeleting?: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemLabel = 'Record',
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex flex-col items-center px-6 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
            <svg className="h-6 w-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-2 pt-4 text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Delete {itemLabel}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Are you sure you want to delete{' '}
            <span className="font-medium text-slate-700 dark:text-slate-200">{itemName}</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 px-6 pb-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {isDeleting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
