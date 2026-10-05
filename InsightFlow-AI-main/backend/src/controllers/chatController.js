import { supabase } from '../config/supabase.js'
import { streamChatResponse } from '../services/groqService.js'

export const getMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const clearMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { projectId, message } = req.body;

    if (!projectId || !message) {
      return res.status(400).json({ error: 'Project ID and message are required' });
    }

    // 1. Save User Message
    const { error: insertUserError } = await supabase
      .from('chat_messages')
      .insert({ project_id: projectId, role: 'user', content: message });
    if (insertUserError) throw insertUserError;

    // 2. Fetch Project Analysis to Build Context
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis')
      .select('summary, themes, top_problems, user_segments, roadmap, recommendations')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (analysisError) {
      console.error('Error fetching analysis context:', analysisError);
    }

    // Build Context String
    let contextString = '';
    if (analysis) {
      contextString = JSON.stringify({
        executiveSummary: analysis.summary,
        topProblems: analysis.top_problems,
        themes: analysis.themes,
        userSegments: analysis.user_segments,
        roadmap: analysis.roadmap,
        recommendations: analysis.recommendations
      }, null, 2);
    } else {
      contextString = 'No analysis data found for this project.';
    }

    // 3. Fetch Recent Chat History (last 20 messages for context)
    const { data: recentMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (messagesError) throw messagesError;

    const chatHistory = (recentMessages || []).reverse();

    // 4. Stream response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const fullResponse = await streamChatResponse(chatHistory, contextString, res);

    // 5. Save Assistant Message
    const { error: insertAssistantError } = await supabase
      .from('chat_messages')
      .insert({ project_id: projectId, role: 'assistant', content: fullResponse });
    
    if (insertAssistantError) {
      console.error('Error saving assistant message:', insertAssistantError);
    }

    res.end();
  } catch (error) {
    console.error('Chat Error:', error);
    // If headers already sent, we just end the connection
    if (res.headersSent) {
      res.end();
    } else {
      next(error);
    }
  }
};
