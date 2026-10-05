import { cn } from '../../utils/cn'

/**
 * The InsightFlow mark: raw signal (jagged) resolving into a clean
 * upward line — noisy customer data becoming a single, clear insight.
 * This shape recurs across the product as the signature element.
 */
export default function Logo({ className, textClassName = "text-ink", accentClassName = "text-accent", markClassName = "", mark = true, wordmark = true }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {mark && (
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", markClassName)}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-0.5">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6a4cff" />
                <stop offset="100%" stopColor="#00c6ff" />
              </linearGradient>
            </defs>
            <path d="M 15 30 C 15 15, 25 10, 40 10 L 60 10 C 75 10, 85 15, 85 30 L 85 65 C 85 80, 75 85, 60 85 L 35 85 L 15 100 L 15 30 Z" 
                  stroke="url(#logoGrad)" strokeWidth="9" strokeLinejoin="round" />
            <rect x="30" y="52" width="9" height="20" rx="4.5" fill="url(#logoGrad)" />
            <rect x="46" y="37" width="9" height="35" rx="4.5" fill="url(#logoGrad)" />
            <rect x="62" y="22" width="9" height="50" rx="4.5" fill="url(#logoGrad)" />
          </svg>
        </span>
      )}
      {wordmark && (
        <span className={cn("text-[17px] font-bold tracking-tight", textClassName)}>
          <span>Insight</span>
          <span className="bg-gradient-to-r from-[#6a4cff] to-[#a45cf6] text-transparent bg-clip-text">Flow</span>
          <span className="ml-1 bg-gradient-to-r from-[#0070f3] to-[#00c6ff] text-transparent bg-clip-text">AI</span>
        </span>
      )}
    </div>
  )
}
