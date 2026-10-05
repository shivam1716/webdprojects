import { supabase } from '../config/supabase.js'

export const globalSearch = async (req, res, next) => {
  try {
    const userId = req.user.id
    const query = req.query.q

    if (!query) {
      return res.json({ success: true, data: [] })
    }

    const ilikeQuery = `%${query}%`

    const [projectsRes, uploadsRes, reportsRes] = await Promise.all([
      supabase.from('projects')
        .select('id, title, description')
        .eq('user_id', userId)
        .ilike('title', ilikeQuery)
        .limit(5),
      
      // uploads doesn't have user_id, so we either join projects, or just assume the user won't guess UUIDs.
      // Better to join projects to ensure it belongs to the user.
      supabase.from('uploads')
        .select('id, filename, project_id, projects!inner(user_id)')
        .eq('projects.user_id', userId)
        .ilike('filename', ilikeQuery)
        .limit(5),

      supabase.from('reports')
        .select('id, report_type, project_id, projects!inner(user_id)')
        .eq('projects.user_id', userId)
        .ilike('report_type', ilikeQuery)
        .limit(5)
    ])

    const results = []

    if (projectsRes.data) {
      projectsRes.data.forEach(p => {
        results.push({
          type: 'project',
          id: p.id,
          title: p.title,
          subtitle: p.description,
          link: `/analysis/${p.id}`
        })
      })
    }

    if (uploadsRes.data) {
      uploadsRes.data.forEach(u => {
        results.push({
          type: 'upload',
          id: u.id,
          title: u.filename,
          subtitle: 'Uploaded File',
          link: `/analysis/${u.project_id}`
        })
      })
    }

    if (reportsRes.data) {
      reportsRes.data.forEach(r => {
        results.push({
          type: 'report',
          id: r.id,
          title: r.report_type || 'Report',
          subtitle: 'Generated Report',
          link: `/reports`
        })
      })
    }

    res.json({ success: true, data: results })
  } catch (error) {
    next(error)
  }
}
