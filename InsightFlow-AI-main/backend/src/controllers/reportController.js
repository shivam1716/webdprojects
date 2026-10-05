import { supabase } from '../config/supabase.js'
import { generatePdfReport } from '../services/pdfService.js'
import { activeLocks } from '../utils/lock.js'

export const getReports = async (req, res, next) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('reports')
      .select('*, projects!inner(user_id, title, analysis(summary, themes))')
      .eq('projects.user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Map projects.title and analysis data into the report data if needed for UI
    const formatted = data.map(r => {
      const projAnalysis = r.projects?.analysis && r.projects.analysis.length > 0 ? r.projects.analysis[0] : {}
      return {
        ...r,
        project_title: r.projects?.title,
        summary: projAnalysis.summary,
        themes: projAnalysis.themes
      }
    })

    res.json({ success: true, data: formatted })
  } catch (error) {
    next(error)
  }
}

export const generateReport = async (req, res, next) => {
  try {
    const { projectId, reportType = 'Executive Summary' } = req.body

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' })
    }

    const lockKey = `report-${projectId}`;
    if (activeLocks.has(lockKey)) {
      return res.status(409).json({ success: false, message: 'Report generation is already running for this project.' });
    }
    activeLocks.add(lockKey);

    try {

    // Verify project belongs to user
    const { data: project, error: pError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('id', projectId)
      .eq('user_id', req.user.id)
      .single()

    if (pError || !project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    // Verify analysis exists
    const { data: analysisData, error: aError } = await supabase
      .from('analysis')
      .select('*')
      .eq('project_id', projectId)
      .single()

    if (aError || !analysisData) {
      return res.status(400).json({ success: false, message: 'Analysis must be complete to generate a report' })
    }

    // Check if an up-to-date report already exists
    const { data: existingReports, error: existingError } = await supabase
      .from('reports')
      .select('*')
      .eq('project_id', projectId)
      .eq('report_type', reportType)
      .order('created_at', { ascending: false })
      .limit(1);

    const existingReport = existingReports && existingReports.length > 0 ? existingReports[0] : null;

    if (existingReport && analysisData.analyzed_at) {
      const reportTime = new Date(existingReport.created_at).getTime();
      const analysisTime = new Date(analysisData.analyzed_at).getTime();
      if (reportTime >= analysisTime) {
        // Return existing report since analysis hasn't changed
        return res.status(200).json({ success: true, data: existingReport });
      }
    }

    // Generate PDF Buffer
    const pdfBuffer = await generatePdfReport(analysisData, project.title);

    // Upload to Supabase Storage
    const fileName = `reports/${req.user.id}/${projectId}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('project-uploads')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('PDF Upload Error:', uploadError);
      return res.status(500).json({ success: false, message: 'Failed to upload PDF report' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('project-uploads')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('reports')
      .insert([{
        project_id: projectId,
        report_type: reportType,
        report_url: publicUrlData.publicUrl
      }])
      .select('*, projects(title)')
      .single()

    if (error) throw error

    res.status(201).json({ success: true, data })
    } finally {
      activeLocks.delete(lockKey);
    }
  } catch (error) {
    next(error)
  }
}

export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Check ownership
    const { data: report, error: findError } = await supabase
      .from('reports')
      .select('projects!inner(user_id)')
      .eq('id', id)
      .single()

    if (findError || !report) {
      return res.status(404).json({ success: false, message: 'Report not found' })
    }

    if (report.projects.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' })
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Report deleted' })
  } catch (error) {
    next(error)
  }
}
