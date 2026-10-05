import { useState, useEffect } from 'react'
import { Menu, Plus, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../ui/SearchBar'
import Button from '../ui/Button'
import { apiFetch } from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'

export default function Navbar({ onMenuClick, onNewProject, title }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    const fetchSearch = async () => {
      setIsSearching(true)
      try {
        const res = await apiFetch(`/search?q=${encodeURIComponent(debouncedQuery)}`)
        setResults(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }
    fetchSearch()
  }, [debouncedQuery])

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-8 lg:px-12">
      <button
        onClick={onMenuClick}
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-sunken lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" strokeWidth={2} />
      </button>

      {title && <h2 className="hidden shrink-0 text-[15px] font-semibold text-ink lg:block">{title}</h2>}

      <div className="relative max-w-md flex-1">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search projects, files, reports..."
          shortcut="\u2318K"
          className="w-full"
        />
        
        {/* Search Results Dropdown */}
        {query && (
          <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50">
            {isSearching ? (
              <div className="flex items-center justify-center p-6 text-ink-faint">
                <Loader2 className="size-5 animate-spin mr-2" /> Searching...
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto p-2">
                {results.map((r, i) => (
                  <li key={`${r.type}-${r.id}-${i}`}>
                    <Link
                      to={r.link}
                      onClick={() => { setQuery(''); setResults([]) }}
                      className="block rounded-lg px-3 py-2 hover:bg-sunken transition-colors"
                    >
                      <p className="text-[13px] font-medium text-ink">{r.title}</p>
                      <p className="text-[11.5px] text-ink-faint mt-0.5">{r.subtitle} • {r.type}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-[13px] text-ink-faint">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button size="sm" icon={Plus} className="hidden sm:inline-flex" onClick={onNewProject}>
          New Project
        </Button>
      </div>
    </header>
  )
}
