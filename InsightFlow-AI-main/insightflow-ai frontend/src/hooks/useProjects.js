import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function useProjects() {
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiFetch('/projects')
      setProjects(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchProjects()
    
    const handleProjectCreated = () => {
      fetchProjects()
    }
    
    window.addEventListener('projectCreated', handleProjectCreated)
    return () => window.removeEventListener('projectCreated', handleProjectCreated)
  }, [fetchProjects])

  return { projects, isLoading, error, refetch: fetchProjects }
}
