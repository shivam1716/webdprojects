import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'
import Input from './Input'
import { apiFetch } from '../../services/api'
import { useToast } from './Toaster'
import { useProjects } from '../../hooks/useProjects'
import { useNavigate } from 'react-router-dom'

export default function NewProjectModal({ isOpen, onClose }) {
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      addToast('Project title is required', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ title, description })
      })
      
      // Notify all components that a project was created
      window.dispatchEvent(new CustomEvent('projectCreated'))
      
      addToast('Project created successfully', 'success')
      onClose()
    } catch (error) {
      addToast(error.message || 'Failed to create project', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md scale-100 overflow-hidden rounded-2xl bg-surface p-6 text-left align-middle shadow-xl transition-all">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-ink">Create new project</h3>
          <button 
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-ink-soft hover:bg-sunken"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-ink">Project Title <span className="text-red-500">*</span></label>
            <Input 
              autoFocus
              placeholder="e.g. Q3 Customer Feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-ink">Description</label>
            <Input 
              placeholder="Briefly describe the goal of this project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
