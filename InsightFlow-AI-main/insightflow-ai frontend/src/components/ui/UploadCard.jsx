import { useCallback, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * UploadCard — drag-and-drop surface. Visual only: onFiles receives the
 * FileList/array for the parent to handle (no upload logic lives here).
 */
export default function UploadCard({ onFiles, accept = '.csv,.txt,.pdf,.docx,.xlsx', multiple = true, className }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer?.files?.length) onFiles?.(Array.from(e.dataTransfer.files))
    },
    [onFiles]
  )

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors duration-150',
        isDragging ? 'border-accent bg-accent-soft' : 'border-border-strong bg-sunken/60 hover:bg-sunken',
        className
      )}
    >
      <span
        className={cn(
          'mb-4 flex size-14 items-center justify-center rounded-full transition-colors',
          isDragging ? 'bg-accent text-white' : 'bg-surface text-accent border border-border'
        )}
      >
        <UploadCloud className="size-6" strokeWidth={1.8} />
      </span>
      <p className="text-sm font-medium text-ink">
        <span className="text-accent">Click to upload</span> or drag and drop
      </p>
      <p className="mt-1.5 text-xs text-ink-faint">
        Transcripts, ticket exports, or survey files — up to 500MB each
      </p>
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.length && onFiles?.(Array.from(e.target.files))}
      />
    </label>
  )
}
