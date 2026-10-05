import { supabase } from '../config/supabase.js'
import { getProjects as getProjectsService, createProject as createProjectService, updateProject as updateProjectService, deleteProject as deleteProjectService } from '../services/projectService.js'

export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })

    const projects = await getProjectsService(userId)
    res.json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' })
    }

    const project = await createProjectService(userId, title, description)
    res.status(201).json({ success: true, message: 'Project created successfully', data: project })
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const updates = req.body

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' })
    }

    const project = await updateProjectService(projectId, updates)
    res.json({ success: true, message: 'Project updated successfully', data: project })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' })
    }

    await deleteProjectService(projectId)
    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    next(error)
  }
}
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id

    // In a real app we might write a more complex query.
    // For now we do concurrent exact count requests
    const [projectsRes, uploadsRes, reportsRes] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('uploads').select('*, projects!inner(user_id)', { count: 'exact', head: true }).eq('projects.user_id', userId),
      supabase.from('reports').select('*, projects!inner(user_id)', { count: 'exact', head: true }).eq('projects.user_id', userId)
    ])

    res.json({
      success: true,
      data: {
        projects: projectsRes.count || 0,
        uploads: uploadsRes.count || 0,
        reports: reportsRes.count || 0
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getActivity = async (req, res, next) => {
  try {
    const userId = req.user.id

    const [projectsRes, uploadsRes, reportsRes] = await Promise.all([
      supabase.from('projects').select('id, title, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('uploads').select('id, filename, uploaded_at, projects!inner(title, user_id)').eq('projects.user_id', userId).order('uploaded_at', { ascending: false }).limit(10),
      supabase.from('reports').select('id, report_type, created_at, projects!inner(title, user_id)').eq('projects.user_id', userId).order('created_at', { ascending: false }).limit(10)
    ])

    const activities = []

    if (projectsRes.data) {
      projectsRes.data.forEach(p => {
        activities.push({
          id: `p-${p.id}`,
          type: 'project',
          actor: 'You',
          action: 'created project',
          target: p.title,
          time: new Date(p.created_at).getTime(),
          timeStr: new Date(p.created_at).toLocaleDateString()
        })
      })
    }

    if (uploadsRes.data) {
      uploadsRes.data.forEach(u => {
        activities.push({
          id: `u-${u.id}`,
          type: 'upload',
          actor: 'You',
          action: 'uploaded file',
          target: u.filename,
          time: new Date(u.uploaded_at).getTime(),
          timeStr: new Date(u.uploaded_at).toLocaleDateString()
        })
      })
    }

    if (reportsRes.data) {
      reportsRes.data.forEach(r => {
        activities.push({
          id: `r-${r.id}`,
          type: 'report',
          actor: 'You',
          action: 'generated report',
          target: r.report_type || 'Report',
          time: new Date(r.created_at).getTime(),
          timeStr: new Date(r.created_at).toLocaleDateString()
        })
      })
    }

    activities.sort((a, b) => b.time - a.time)

    res.json({
      success: true,
      data: activities.slice(0, 10)
    })
  } catch (error) {
    next(error)
  }
}
