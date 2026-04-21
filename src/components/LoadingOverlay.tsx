import { BrandLogo } from './BrandLogo'

type LoadingOverlayProps = {
  isVisible: boolean
  message?: string
  fullscreen?: boolean
}

export function LoadingOverlay({
  isVisible,
  message = 'Processing request...',
  fullscreen = false,
}: LoadingOverlayProps) {
  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`${
        fullscreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-20 rounded-2xl'
      } flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-slate-400/70 dark:border-slate-500/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BrandLogo sizeClassName="h-11 w-11" textClassName="text-xs" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{message}</p>
      </div>
    </div>
  )
}
