import { useState, useEffect } from 'react'
import { FileBarChart, Download, Share2, MoreHorizontal, Plus, FileText, File } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SearchBar from '../components/ui/SearchBar'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { apiFetch } from '../services/api'
import { useToast } from '../components/ui/Toaster'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useProjects } from '../hooks/useProjects'
import { cn } from '../utils/cn'

export default function ReportsPage() {
  const { addToast } = useToast()

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [activeReport, setActiveReport] = useState(null)

  const { projects } = useProjects()
  // Ensure we check if projects exist before mapping
  const hasCompletedProject = projects?.some(p => p.status === 'Completed')

  const fetchReports = async () => {
    try {
      const res = await apiFetch('/reports')
      const formatted = (res.data || []).map(r => ({
        id: r.id,
        title: r.report_type || 'Report',
        project: r.project_title || 'Unknown Project',
        createdAt: new Date(r.created_at).toLocaleDateString(),
        format: 'PDF',
        pages: 1, // PDF kit generates a small document, usually 1-2 pages
        summary: r.summary,
        themes: r.themes,
        reportUrl: r.report_url
      }))
      setReports(formatted)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleNewReport = async () => {
    if (!hasCompletedProject) {
      addToast('Analysis must be completed for at least one project to generate a report.', 'error')
    } else {
      try {
        const completedProject = projects.find(p => p.status === 'Completed')
        await apiFetch('/reports/generate', {
          method: 'POST',
          body: JSON.stringify({ projectId: completedProject.id })
        })
        addToast('Report generated successfully!', 'success')
        fetchReports()
      } catch (e) {
        addToast(e.message || 'Failed to generate report', 'error')
      }
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this report?')) return
    try {
      await apiFetch(`/reports/${id}`, { method: 'DELETE' })
      addToast('Report deleted', 'success')
      fetchReports()
    } catch (err) {
      addToast('Failed to delete report', 'error')
    }
  }

  const filtered = reports.filter((r) => (r.title || '').toLowerCase().includes(query.toLowerCase()))

  const openPreview = (report) => {
    setActiveReport(report)
    setPreviewOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <PageHeader
        eyebrow="Deliverables"
        title="Reports"
        description="Structured summaries generated from your projects, ready to share."
        actions={<Button icon={Plus} onClick={handleNewReport}>New Report</Button>}
      />

      <div className="flex items-center justify-between">
        <SearchBar value={query} onChange={setQuery} placeholder="Search reports..." className="sm:max-w-xs" />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileBarChart}
          title="No reports found"
          description="Generate a report from any project's Analysis tab, or adjust your search."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              onClick={() => openPreview(r)}
              className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface transition-shadow hover:shadow-raised hover:border-border-strong cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sunken text-ink-soft group-hover:bg-accent-soft group-hover:text-accent transition-colors">
                  <FileText className="size-[18px]" strokeWidth={2} />
                </div>
                <button
                  onClick={(e) => handleDelete(e, r.id)}
                  className="flex size-8 items-center justify-center rounded-lg text-ink-faint hover:bg-sunken hover:text-red-500 transition-colors"
                  aria-label="Delete report"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
              <div className="mt-2">
                <h3 className="text-[14.5px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">{r.title}</h3>
                <p className="mt-1 text-[13px] text-ink-soft">{r.project}</p>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between text-[12px] text-ink-faint border-t border-border">
                <span>{r.createdAt}</span>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral" className="bg-canvas">{r.format}</Badge>
                  <span className="font-mono">{r.pages}p</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={activeReport?.title}
        description={activeReport ? `${activeReport.project} · ${activeReport.createdAt}` : ''}
        size="lg"
        footer={
          <>
            <Button variant="secondary" icon={Share2} onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              addToast('Report link copied to clipboard', 'success')
              setPreviewOpen(false)
            }}>
              Share link
            </Button>
            <Button icon={Download} onClick={() => {
              if (activeReport?.reportUrl) {
                window.open(activeReport.reportUrl, '_blank')
              } else {
                addToast('PDF URL not available', 'error')
              }
              setPreviewOpen(false)
            }}>
              Download {activeReport?.format}
            </Button>
          </>
        }
      >
        <div className="space-y-5 rounded-xl border border-border bg-canvas p-6 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-surface border border-border text-accent">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-ink">Executive Summary Document</p>
              <p className="text-[12px] text-ink-soft">{activeReport?.pages ?? 12} pages · Generated by InsightFlow AI</p>
            </div>
          </div>
          <div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
              {activeReport?.summary || 'No summary available.'}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {activeReport?.themes && Array.isArray(activeReport.themes) ? activeReport.themes.map((tag, i) => {
              if (typeof tag === 'string') {
                return (
                  <Badge key={i} tone="neutral" className="bg-surface border-border w-fit">
                    {tag}
                  </Badge>
                );
              }

              // Structured theme object
              return (
                <div key={i} className="rounded-lg border border-border bg-surface p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[14px] font-semibold text-ink">{tag.theme}</h4>
                    <div className="flex gap-2">
                       {tag.severity && (
                         <Badge tone="neutral" className={
                           tag.severity?.toLowerCase() === 'critical' ? 'bg-red-50 text-red-600 border-red-200 text-[11px]' :
                           tag.severity?.toLowerCase() === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200 text-[11px]' : 'bg-canvas border-border text-[11px]'
                         }>
                           {tag.severity}
                         </Badge>
                       )}
                       {tag.frequency && <Badge tone="neutral" className="bg-canvas border-border text-[11px]">{tag.frequency} mentions</Badge>}
                    </div>
                  </div>
                  {tag.description && <p className="text-[13px] text-ink-soft mb-3">{tag.description}</p>}
                  
                  {tag.painPoints && tag.painPoints.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-[12px] font-medium text-ink-faint uppercase mb-1">Pain Points</h5>
                      <ul className="list-disc pl-4 text-[12.5px] text-ink-soft space-y-1">
                        {tag.painPoints.map((pp, j) => <li key={j}>{pp}</li>)}
                      </ul>
                    </div>
                  )}

                  {tag.representativeQuotes && tag.representativeQuotes.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-[12px] font-medium text-ink-faint uppercase mb-1">Quotes</h5>
                      <ul className="list-disc pl-4 text-[12.5px] text-ink-soft italic space-y-1">
                        {tag.representativeQuotes.map((q, j) => <li key={j}>"{q}"</li>)}
                      </ul>
                    </div>
                  )}

                  {tag.affectedSegments && tag.affectedSegments.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-[12px] font-medium text-ink-faint uppercase mb-1">Affected Segments</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tag.affectedSegments.map((seg, j) => (
                           <Badge key={j} tone="neutral" className="text-[11px]">{seg}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {tag.supportingDocuments && tag.supportingDocuments.length > 0 && (
                    <div className="text-[12px] text-ink-faint mt-3 border-t border-border pt-2">
                      <span className="font-medium">Sources: </span>
                      {tag.supportingDocuments.join(', ')}
                    </div>
                  )}
                </div>
              );
            }) : null}
          </div>
        </div>
      </Modal>
    </div>
  )
}
