import Logo from '../ui/Logo'

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
)

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <Logo textClassName="text-white" accentClassName="text-slate-400" />
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Turn customer interviews, tickets, and surveys into product decisions you can act on.
            </p>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-white">Product</h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a href="#product" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-white">Contact</h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a href="https://www.instagram.com/bhavya.aneja?igsh=MTVzMGtyZW9mcTY4dQ==" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <InstagramIcon className="size-4" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://github.com/bhavyaaneja27" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <GithubIcon className="size-4" /> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/bhavya-aneja-120437380" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <LinkedinIcon className="size-4" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6 text-center">
          <p className="text-sm font-medium text-slate-400">
            Made by Bhavya Aneja as a part of hackathon CODEBENDERS X PRODUCT SPACE
          </p>
        </div>
      </div>
    </footer>
  )
}
