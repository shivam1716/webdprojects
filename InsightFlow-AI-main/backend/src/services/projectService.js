import { supabase } from '../config/supabase.js'

export const createProject = async (userId, title, description) => {
  if (!userId || !title) {
    throw new Error('Missing required fields: userId, title')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{ user_id: userId, title, description, status: 'draft' }])
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return { ...data, file_count: 0 }
}

export const getProjects = async (userId) => {
  if (!userId) {
    throw new Error('Missing required field: userId')
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*, uploads(count), analysis(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return data.map(p => {
    const file_count = p.uploads?.[0]?.count || 0
    const analysis_count = p.analysis?.[0]?.count || 0
    delete p.uploads
    delete p.analysis

    let displayStatus = 'Analysis Pending'
    if (analysis_count > 0) {
      displayStatus = 'Completed'
    } else if (file_count > 0) {
      displayStatus = 'Analysis Not Run'
    }

    return { ...p, file_count, status: displayStatus }
  })
}

export const updateProject = async (projectId, updates) => {
  if (!projectId) {
    throw new Error('Missing required field: projectId')
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`)
  }

  return data
}

export const deleteProject = async (projectId) => {
  if (!projectId) {
    throw new Error('Missing required field: projectId')
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`)
  }

  return true
}
