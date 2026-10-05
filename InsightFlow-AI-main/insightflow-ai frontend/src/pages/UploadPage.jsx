import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileAudio,
  FileSpreadsheet,
  FileText,
  File as FileIcon,
  X,
  CheckCircle2,
  Sparkles,
  FolderKanban,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import UploadCard from '../components/ui/UploadCard'
import ProgressBar from '../components/ui/ProgressBar'
import Input from '../components/ui/Input'
import { apiFetch } from '../services/api'
import { useToast } from '../components/ui/Toaster'
import { useProjects } from '../hooks/useProjects'

const typeIcon = (name = '') => {
  if (/\.(mp3|wav|m4a)$/i.test(name)) return FileAudio
  if (/\.(csv|xlsx|xls)$/i.test(name)) return FileSpreadsheet
  if (/\.(txt|pdf|docx)$/i.test(name)) return FileText
  return FileIcon
}

const formatFileSize = (bytes) => {
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${Math.round(kb)} KB`
  }
  return `${(kb / 1024).toFixed(1)} MB`
}


const sourceTypes = ['Interviews', 'Support Tickets', 'Surveys', 'Transcripts']

export default function UploadPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  
  const { projects } = useProjects()
  
  const [queue, setQueue] = useState([])
  const [existingFiles, setExistingFiles] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('new')
  const [projectName, setProjectName] = useState('')
  const [sourceType, setSourceType] = useState(sourceTypes[0])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (selectedProjectId === 'new') {
      setExistingFiles([])
      return
    }
    const fetchExisting = async () => {
      try {
        const res = await apiFetch(`/uploads/${selectedProjectId}`)
        setExistingFiles(res.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchExisting()
  }, [selectedProjectId])

  const handleFiles = (fileList) => {
    const newItems = fileList.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      name: f.name,
      size: formatFileSize(f.size),
      file: f,
      progress: 0,
    }))
    setQueue((q) => [...newItems, ...q])
  }

  const removeItem = (id) => setQueue((q) => q.filter((i) => i.id !== id))

  const uploadFilesToProject = async (projectId) => {
    const formData = new FormData()
    formData.append('projectId', projectId)
    queue.forEach(item => {
      formData.append('files', item.file)
    })
    
    await apiFetch('/uploads', {
      method: 'POST',
      body: formData
    })
  }

  const handleAction = async (actionType) => {
    if (selectedProjectId === 'new' && !projectName.trim()) {
      addToast('Please enter a project name', 'error')
      return
    }

    setIsUploading(true)
    try {
      let targetProjectId = selectedProjectId

      if (targetProjectId === 'new') {
        const projectRes = await apiFetch('/projects', {
          method: 'POST',
          body: JSON.stringify({ title: projectName, description: `${sourceType} analysis` })
        })
        targetProjectId = projectRes.data.id
      }

      if (queue.length > 0) {
        await uploadFilesToProject(targetProjectId)
      }
      
      if (actionType === 'save') {
        addToast(queue.length > 0 ? 'Files uploaded successfully' : 'Project saved', 'success')
        navigate('/projects')
      } else {
        navigate(`/analysis/${targetProjectId}`)
      }
    } catch (err) {
      addToast(err.message || 'Failed to process', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Add sources"
        title="Upload files"
        description="Add interviews, tickets, surveys, or transcripts to an existing project."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardTitle className="mb-4">Choose destination</CardTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-ink">Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink shadow-flat focus:outline-none focus:ring-4 focus:ring-accent-soft focus:border-accent"
                >
                  <option value="new">+ Create New Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              {selectedProjectId === 'new' && (
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-ink">New Project Name</label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Q3 Customer Feedback"
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-ink">Source type</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink shadow-flat focus:outline-none focus:ring-4 focus:ring-accent-soft focus:border-accent"
                >
                  {sourceTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <UploadCard onFiles={handleFiles} />

          {existingFiles.length > 0 && (
            <Card padding="p-0" className="mt-6">
              <div className="border-b border-border px-6 py-4">
                <CardTitle>Existing files ({existingFiles.length})</CardTitle>
              </div>
              <ul className="divide-y divide-border">
                {existingFiles.map(file => {
                  const Icon = typeIcon(file.filename)
                  return (
                    <li key={file.id} className="flex items-center gap-3 px-6 py-4 opacity-75 bg-canvas">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sunken text-ink-soft">
                        <Icon className="size-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink">{file.filename}</p>
                        <span className="shrink-0 font-mono text-[11.5px] text-ink-faint">
                          {formatFileSize(file.file_size)}
                        </span>
                      </div>
                      <CheckCircle2 className="size-4 shrink-0 text-success" />
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}

          {queue.length > 0 && (
            <Card padding="p-0">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <CardTitle>Upload queue ({queue.length})</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setQueue([])}>
                  Clear all
                </Button>
              </div>
              <ul className="divide-y divide-border">
                {queue.map((item) => {
                  const Icon = typeIcon(item.name)
                  const done = item.progress >= 100
                  return (
                    <li key={item.id} className="flex items-center gap-3 px-6 py-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sunken text-ink-soft">
                        <Icon className="size-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[13px] font-medium text-ink">{item.name}</p>
                          <span className="shrink-0 font-mono text-[11.5px] text-ink-faint">{item.size}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2.5">
                          <ProgressBar value={100} tone="accent" className="flex-1" />
                          <CheckCircle2 className="size-4 shrink-0 text-success" strokeWidth={2} />
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-faint hover:bg-sunken hover:text-ink"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="flex items-center justify-end gap-2.5 border-t border-border px-6 py-4">
                <Button variant="secondary" onClick={() => handleAction('save')} disabled={isUploading || (selectedProjectId === 'new' && !projectName.trim())}>
                  {isUploading ? 'Uploading...' : 'Save for later'}
                </Button>
                <Button 
                  onClick={() => handleAction('analyze')} 
                  icon={Sparkles}
                  disabled={isUploading || (selectedProjectId === 'new' && !projectName.trim())}
                >
                  {isUploading ? 'Uploading...' : 'Start analysis'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardTitle className="mb-3">Supported formats</CardTitle>
            <ul className="space-y-2.5 text-[13px] text-ink-soft">
              {[
                { label: 'Audio — .mp3, .wav, .m4a', soon: true },
                { label: 'Documents — .txt, .pdf, .docx' },
                { label: 'Spreadsheets — .csv, .xlsx' },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                  {item.label}
                  {item.soon && (
                    <span className="rounded-full bg-sunken px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-ink-faint uppercase">
                      Soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-canvas border-border">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border text-ink-soft">
                <FolderKanban className="size-[18px]" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13.5px] font-semibold text-ink">Batch uploading?</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  Drop an entire folder export — InsightFlow automatically groups files by
                  source type before analysis begins.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
