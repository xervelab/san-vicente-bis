type BrandLogoProps = {
  sizeClassName?: string
  textClassName?: string
}

export function BrandLogo({
  sizeClassName = 'h-10 w-10',
  textClassName = 'text-sm',
}: BrandLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-slate-900 font-bold text-white dark:bg-slate-100 dark:text-slate-900 ${sizeClassName} ${textClassName}`}
      aria-label="Barangay San Vicente logo"
    >
      SV
    </div>
  )
}
