import { supabase } from '../config/supabase.js'
import { extractDocument } from '../services/extractionService.js'
import { analyzeDocument } from '../services/groqService.js'
import { activeLocks } from '../utils/lock.js'

export const getAnalysis = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('analysis')
      .select('*')
      .eq('project_id', req.params.projectId)
      .single()
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
      throw error
    }
    
    res.json({ success: true, data: data || null })
  } catch (error) {
    next(error)
  }
}

export const runAnalysis = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    const lockKey = `analysis-${projectId}`;
    if (activeLocks.has(lockKey)) {
      return res.status(409).json({ success: false, message: 'Analysis is already running for this project.' });
    }
    activeLocks.add(lockKey);

    try {

    const startTime = Date.now();

    // 1. Set project status to processing
    await supabase.from('projects').update({ status: 'processing' }).eq('id', projectId);

    // 2. Fetch all uploads for the project
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('*')
      .eq('project_id', projectId);

    if (uploadsError) throw uploadsError;
    if (!uploads || uploads.length === 0) {
      return res.status(400).json({ success: false, message: 'No files to analyze' });
    }

    // 3. Download and extract text from all files
    let combinedText = '';
    for (const upload of uploads) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('project-uploads')
        .download(upload.storage_path);
        
      if (downloadError) {
        console.error(`Error downloading ${upload.filename}:`, downloadError);
        continue;
      }

      const buffer = Buffer.from(await fileData.arrayBuffer());
      const file = {
        buffer,
        originalname: upload.filename,
        mimetype: upload.file_type
      };

      try {
        const extraction = await extractDocument(file);
        combinedText += `\n--- Document: ${upload.filename} ---\n${extraction.text}\n`;
      } catch (err) {
        console.error(`Error extracting ${upload.filename}:`, err);
      }
    }

    if (!combinedText.trim()) {
      await supabase.from('projects').update({ status: 'files_uploaded' }).eq('id', projectId);
      return res.status(500).json({ success: false, message: 'Failed to extract text from files' });
    }

    // 4. Run Groq AI Analysis
    const analysisResult = await analyzeDocument(combinedText);
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    // Map confidence string to numeric score
    let confScore = 0;
    const confRaw = analysisResult.overallInsights?.confidence || analysisResult.confidence;
    if (typeof confRaw === 'number') {
      confScore = confRaw;
    } else {
      const confStr = (confRaw || '').toString().toLowerCase();
      if (confStr.includes('high')) confScore = 95.0;
      else if (confStr.includes('medium')) confScore = 70.0;
      else if (confStr.includes('low')) confScore = 50.0;
      else confScore = parseFloat(confStr) || 0;
    }

    const sentimentValue = analysisResult.overallInsights?.overallSentiment || analysisResult.sentiment || 'Neutral';

    // 5. Save results to the database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analysis')
      .insert([{
        project_id: projectId,
        summary: analysisResult.executiveSummary,
        key_insights: analysisResult.keyInsights || [],
        themes: analysisResult.themes,
        recommendations: analysisResult.recommendations,
        sentiment: sentimentValue,
        confidence_score: confScore,
        overall_insights: analysisResult.overallInsights,
        top_problems: analysisResult.topProblems,
        user_segments: analysisResult.userSegments,
        roadmap: analysisResult.roadmap,
        processing_time: processingTime,
        analyzed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (saveError) throw saveError;

    // 6. Set project status to completed
    await supabase.from('projects').update({ status: 'completed' }).eq('id', projectId);

    res.json({ success: true, data: savedAnalysis });
    } finally {
      activeLocks.delete(lockKey);
    }
  } catch (error) {
    console.error('runAnalysis error:', error);
    next(error);
  }
}
