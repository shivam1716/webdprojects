import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

export const protect = (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = { id: decoded.id }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' })
  }
}

export const checkProjectOwnership = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this project' });
    }

    next();
  } catch (error) {
    next(error);
  }
}
