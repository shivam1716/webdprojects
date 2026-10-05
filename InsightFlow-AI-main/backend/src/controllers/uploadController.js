import { supabase } from '../config/supabase.js'
import { activeLocks } from '../utils/lock.js'

export const uploadFiles = async (req, res, next) => {
  try {
    const userId = req.user.id
    const projectId = req.body.projectId

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' })
    }

    const lockKey = `upload-${projectId}`;
    if (activeLocks.has(lockKey)) {
      return res.status(409).json({ success: false, message: 'An upload is already in progress for this project.' });
    }
    activeLocks.add(lockKey);

    try {

    const uploadedRecords = []

    for (const file of req.files) {
      const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`
      const storagePath = `${userId}/${projectId}/${uniqueFileName}`

      // Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('project-uploads')
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        })

      if (storageError) {
        console.error('Storage upload error:', storageError)
        throw new Error(`Failed to upload ${file.originalname} to storage`)
      }

      const { data: dbData, error: dbError } = await supabase
        .from('uploads')
        .insert([{
          project_id: projectId,
          filename: file.originalname,
          storage_path: storagePath,
          file_type: file.mimetype,
          file_size: file.size
        }])
        .select()
        .single()

      if (dbError) {
        console.error('Database insert error:', dbError)
        throw new Error(dbError.message || `Failed to save ${file.originalname} record to database`)
      }

      uploadedRecords.push(dbData)
    }

    // Update project status to files_uploaded if it is draft
    const { data: project } = await supabase
      .from('projects')
      .select('status')
      .eq('id', projectId)
      .single()

    if (project && project.status === 'draft') {
      await supabase
        .from('projects')
        .update({ status: 'files_uploaded' })
        .eq('id', projectId)
    }

    res.status(201).json({ success: true, message: 'Files uploaded successfully', data: uploadedRecords })
    } finally {
      activeLocks.delete(lockKey);
    }
  } catch (error) {
    next(error)
  }
}

export const getUploads = async (req, res, next) => {
  try {
    const userId = req.user.id
    const projectId = req.params.projectId

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' })
    }

    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('project_id', projectId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      throw error
    }

    res.json({ success: true, data: data || [] })
  } catch (error) {
    next(error)
  }
}
