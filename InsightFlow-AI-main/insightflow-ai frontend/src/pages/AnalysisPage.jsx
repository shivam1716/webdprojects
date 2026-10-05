import { useState, useEffect } from 'react'
import { Sparkles, Download, Share2, FlaskConical, FileIcon } from 'lucide-react'
import Button from '../components/ui/Button'
import Card, { CardTitle, CardDescription } from '../components/ui/Card'
import Badge, { statusTone } from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { useParams, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useProjects } from '../hooks/useProjects'
import { apiFetch } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useToast } from '../components/ui/Toaster'

const formatFileSize = (bytes) => {
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${Math.round(kb)} KB`
  }
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function AnalysisPage() {
  const { projectId } = useParams()
  const { projects } = useProjects()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === projectId)

  const [analysis, setAnalysis] = useState(null)
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const res = await apiFetch('/analysis/run', {
        method: 'POST',
        body: JSON.stringify({ projectId: project.id })
      })
      if (res.success) {
        setAnalysis(res.data)
        addToast('Analysis completed successfully', 'success')
      } else {
        addToast(res.message || 'Failed to run analysis', 'error')
      }
    } catch (err) {
      addToast(err.message || 'An error occurred during analysis', 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (!project) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [analysisRes, uploadsRes] = await Promise.all([
          apiFetch(`/analysis/${project.id}`),
          apiFetch(`/uploads/${project.id}`)
        ])
        setAnalysis(analysisRes.data)
        setUploads(uploadsRes.data || [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [project])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border shrink-0">
        <div>
          {project ? (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-[18px] font-semibold text-ink">{project.title}</h1>
                <Badge tone={statusTone(project.status)}>{project.status}</Badge>
              </div>
              <p className="mt-1 text-[13px] text-ink-soft">{project.description}</p>
            </>
          ) : (
            <>
              <h1 className="text-[18px] font-semibold text-ink">Analysis</h1>
              <p className="mt-1 text-[13px] text-ink-soft">Select a project to view its analysis and insights.</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <select
            value={project?.id || ''}
            onChange={(e) => {
              if (e.target.value) navigate(`/analysis/${e.target.value}`)
            }}
            className="max-w-[200px] truncate h-9 rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-ink shadow-flat focus:outline-none focus:ring-2 focus:ring-accent-soft focus:border-accent transition-all cursor-pointer hover:border-border-strong"
          >
            <option value="" disabled>Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {project && (
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <Button 
                variant="secondary" 
                icon={Share2} 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  addToast('Project link copied to clipboard', 'success')
                }}
              >
                Share
              </Button>
              <Button 
                variant="secondary" 
                icon={Download} 
                onClick={async () => {
                  try {
                    addToast('Generating PDF report...', 'info')
                    const res = await apiFetch('/reports/generate', {
                      method: 'POST',
                      body: JSON.stringify({ projectId: project.id })
                    })
                    if (res.success && res.data?.report_url) {
                      window.open(res.data.report_url, '_blank')
                      addToast('Report generated and downloaded!', 'success')
                    } else {
                      addToast('Failed to generate PDF', 'error')
                    }
                  } catch (e) {
                    addToast(e.message || 'Error generating report', 'error')
                  }
                }}
              >
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {!project ? (
        <div className="flex flex-1 items-center justify-center pt-6">
          <EmptyState
            icon={FlaskConical}
            title="No Project Selected"
            description="Select a project from the dropdown above to view its analysis."
          />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 pt-6 gap-6">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : !analysis && uploads.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-surface border border-border rounded-2xl p-10">
              <EmptyState
                icon={Sparkles}
                title="No Files Uploaded"
                description="Upload files to this project to prepare for analysis."
                actionLabel="Upload Files"
                onAction={() => window.location.href = '/upload'}
              />
            </div>
          ) : !analysis && uploads.length > 0 ? (
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-surface border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-canvas border border-border text-ink-soft mb-4">
                  <FlaskConical className="size-6" />
                </span>
                <h3 className="text-[16px] font-semibold text-ink">Analysis Not Run</h3>
                <p className="mt-1 text-[14px] text-ink-soft max-w-sm mb-6">
                  Analysis Not Run – Files uploaded successfully. AI analysis has not yet been executed.
                </p>
                <Button 
                  onClick={handleRunAnalysis} 
                  disabled={isAnalyzing}
                  icon={Sparkles}
                >
                  {isAnalyzing ? 'Running Analysis...' : 'Run Analysis'}
                </Button>
              </div>
              
              <Card>
                <CardTitle className="mb-4">Uploaded Files ({uploads.length})</CardTitle>
                <ul className="divide-y divide-border">
                  {uploads.map(file => (
                    <li key={file.id} className="flex items-center gap-3 py-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sunken text-ink-soft">
                        <FileIcon className="size-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink">{file.filename}</p>
                        <p className="text-[12px] text-ink-faint">
                          {formatFileSize(file.file_size)} · {new Date(file.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge tone="neutral">{file.status || 'uploaded'}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-6">
              {/* TOP METRICS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <Card className="col-span-1">
                  <CardTitle className="text-[12px] uppercase tracking-wider text-ink-faint">Docs Analyzed</CardTitle>
                  <p className="mt-2 text-[16px] font-medium text-ink">{analysis.overall_insights?.documentsAnalyzed || uploads.length}</p>
                </Card>
                <Card className="col-span-1">
                  <CardTitle className="text-[12px] uppercase tracking-wider text-ink-faint">Est. Customers</CardTitle>
                  <p className="mt-2 text-[16px] font-medium text-ink">{analysis.overall_insights?.estimatedCustomers || 'N/A'}</p>
                </Card>
                <Card className="col-span-1">
                  <CardTitle className="text-[12px] uppercase tracking-wider text-ink-faint">Sentiment</CardTitle>
                  <p className="mt-2 text-[16px] font-medium text-ink">{analysis.sentiment || 'N/A'}</p>
                </Card>
                <Card className="col-span-1">
                  <CardTitle className="text-[12px] uppercase tracking-wider text-ink-faint">AI Confidence</CardTitle>
                  <p className="mt-2 text-[16px] font-medium text-ink">{analysis.confidence_score ? `${analysis.confidence_score}%` : 'N/A'}</p>
                </Card>
              </div>

              {/* EXECUTIVE SUMMARY */}
              <Card>
                <CardTitle>Executive Summary</CardTitle>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {analysis.summary}
                </p>
              </Card>

              {/* TOP PROBLEMS */}
              {analysis.top_problems && Array.isArray(analysis.top_problems) && analysis.top_problems.length > 0 && (
                <Card>
                  <CardTitle>Top Product Problems</CardTitle>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse">
                      <thead>
                        <tr className="border-b border-border text-ink-faint">
                          <th className="pb-2 font-medium">Problem</th>
                          <th className="pb-2 font-medium">Theme</th>
                          <th className="pb-2 font-medium">Frequency</th>
                          <th className="pb-2 font-medium">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.top_problems.map((prob, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="py-3 pr-4 font-medium text-ink">{prob.problem || prob.title}</td>
                            <td className="py-3 pr-4 text-ink-soft">{prob.theme}</td>
                            <td className="py-3 pr-4 text-ink-soft">{prob.frequency}</td>
                            <td className="py-3">
                              <Badge tone="neutral" className={
                                prob.impact?.toLowerCase() === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                                prob.impact?.toLowerCase() === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''
                              }>
                                {prob.impact}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* THEMES & PAIN POINTS */}
              {analysis.themes && Array.isArray(analysis.themes) && analysis.themes.length > 0 && (
                <Card>
                  <CardTitle>Key Themes & Pain Points</CardTitle>
                  <div className="mt-4 space-y-6">
                    {typeof analysis.themes[0] === 'string' ? (
                       <div className="flex flex-wrap gap-2">
                         {analysis.themes.map((theme, i) => (
                           <Badge key={i} tone="primary">{theme}</Badge>
                         ))}
                       </div>
                    ) : (
                      analysis.themes.map((theme, i) => (
                        <div key={i} className="rounded-xl border border-border bg-canvas p-4">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="text-[15px] font-semibold text-ink">{theme.theme}</h4>
                            <div className="flex gap-2">
                              {theme.frequency && <Badge tone="neutral">{theme.frequency} mentions</Badge>}
                              {theme.severity && (
                                <Badge tone="neutral" className={
                                  theme.severity?.toLowerCase() === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                                  theme.severity?.toLowerCase() === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''
                                }>
                                  {theme.severity}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-[13px] text-ink-soft mb-4">{theme.description}</p>
                          
                          {theme.painPoints && theme.painPoints.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-[12px] font-semibold text-ink-faint uppercase mb-2">Pain Points</h5>
                              <ul className="list-disc pl-4 space-y-1 text-[13px] text-ink-soft">
                                {theme.painPoints.map((pp, j) => <li key={j}>{pp}</li>)}
                              </ul>
                            </div>
                          )}
                          
                          {theme.representativeQuotes && theme.representativeQuotes.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-[12px] font-semibold text-ink-faint uppercase mb-2">Representative Quotes</h5>
                              <div className="space-y-2">
                                {theme.representativeQuotes.map((q, j) => (
                                  <blockquote key={j} className="border-l-2 border-border pl-3 text-[13px] italic text-ink-soft">
                                    "{q}"
                                  </blockquote>
                                ))}
                              </div>
                            </div>
                          )}

                          {theme.supportingDocuments && theme.supportingDocuments.length > 0 && (
                            <div className="mt-3 text-[12px] text-ink-faint">
                              <span className="font-medium">Sources: </span>
                              {theme.supportingDocuments.join(', ')}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}
              
              {/* LEGACY KEY INSIGHTS (Fallback) */}
              {analysis.key_insights && Array.isArray(analysis.key_insights) && analysis.key_insights.length > 0 && typeof analysis.key_insights[0] === 'string' && (
                <Card>
                  <CardTitle>Key Insights</CardTitle>
                  <ul className="mt-4 space-y-3">
                    {analysis.key_insights.map((insight, i) => (
                       <li key={i} className="flex gap-3 text-[13.5px] text-ink-soft">
                         <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent text-[11px] font-medium mt-0.5">{i + 1}</span>
                         <span>{insight}</span>
                       </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* ROADMAP */}
              {analysis.roadmap && Array.isArray(analysis.roadmap) && analysis.roadmap.length > 0 && (
                <Card>
                  <CardTitle>Recommended Roadmap</CardTitle>
                  <div className="mt-4 space-y-4">
                    {analysis.roadmap.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-canvas text-[12px] font-bold">
                            {item.priority || i + 1}
                          </div>
                          {i !== analysis.roadmap.length - 1 && <div className="w-px h-full bg-border my-1"></div>}
                        </div>
                        <div className="pb-4">
                          <h4 className="text-[14px] font-semibold text-ink">{item.title}</h4>
                          <p className="mt-1 text-[13px] text-ink-soft">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {/* USER SEGMENTS */}
              {analysis.user_segments && Array.isArray(analysis.user_segments) && analysis.user_segments.length > 0 && (
                <Card>
                  <CardTitle>User Segments</CardTitle>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysis.user_segments.map((seg, i) => (
                      <div key={i} className="rounded-xl border border-border p-4">
                        <h4 className="text-[14px] font-semibold text-ink mb-2">{seg.segment}</h4>
                        {seg.issues && (
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-ink-soft">
                            {seg.issues.map((iss, j) => <li key={j}>{iss}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* RECOMMENDATIONS (Legacy or simple strings) */}
              {analysis.recommendations && Array.isArray(analysis.recommendations) && typeof analysis.recommendations[0] === 'string' && (
                <Card>
                  <CardTitle>Recommendations</CardTitle>
                  <ul className="mt-4 space-y-3">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 text-[13.5px] text-ink-soft">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success text-[11px] font-medium mt-0.5">{i + 1}</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
