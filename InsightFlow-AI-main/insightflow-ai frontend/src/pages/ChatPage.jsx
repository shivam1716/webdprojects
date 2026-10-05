import { useState, useEffect } from 'react'
import { Send, Sparkles, FolderKanban, Paperclip, Trash2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Avatar from '../components/ui/Avatar'
import { API_URL } from '../services/api'
import { useProjects } from '../hooks/useProjects'
import EmptyState from '../components/ui/EmptyState'
import { cn } from '../utils/cn'

function MessageRow({ role, text }) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex gap-4 max-w-4xl mx-auto w-full px-4 py-6', !isUser && 'bg-surface border-y border-border')}>
      <div className="shrink-0 mt-1">
        {isUser ? (
          <Avatar name="Maya Chen" size="sm" />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
            <Sparkles className="size-4" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-ink mb-1.5">{isUser ? 'You' : 'InsightFlow AI'}</p>
        <div className="text-[14px] leading-relaxed text-ink-soft whitespace-pre-wrap">
          {text}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { projects } = useProjects()
  const [chatMessages, setChatMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [project, setProject] = useState('')

  useEffect(() => {
    if (projects.length > 0 && !project) {
      setProject(projects[0].id)
    }
  }, [projects, project])

  // Fetch chat history when project changes
  useEffect(() => {
    if (project) {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/chat/${project}`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            const data = await res.json();
            setChatMessages(data.map(m => ({ id: m.id, role: m.role, text: m.content })));
          }
        } catch (e) {
          console.error('Failed to fetch chat history', e);
        }
      }
      fetchHistory();
    } else {
      setChatMessages([]);
    }
  }, [project]);

  const send = async (text) => {
    const value = text ?? draft;
    if (!value.trim() || !isCompleted) return;
    
    const userMsgId = `u-${Date.now()}`;
    const astMsgId = `a-${Date.now()}`;
    
    setChatMessages((prev) => [...prev, { id: userMsgId, role: 'user', text: value }]);
    setDraft('');
    setThinking(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ projectId: project, message: value })
      });
      
      setThinking(false);
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Add empty assistant message that will be populated
      setChatMessages((prev) => [...prev, { id: astMsgId, role: 'assistant', text: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setChatMessages((prev) => 
          prev.map((msg) => 
            msg.id === astMsgId 
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      }
    } catch (e) {
      setThinking(false);
      console.error(e);
      setChatMessages((prev) => [...prev, { id: astMsgId, role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
  }

  const clearChat = async () => {
    if (!project) return;
    if (!window.confirm('Are you sure you want to clear this chat history?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat/${project}`, { 
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setChatMessages([]);
      }
    } catch (e) {
      console.error('Failed to clear chat', e);
    }
  }

  const activeProject = projects.find(p => p.id === project) || projects[0]
  const isCompleted = activeProject?.status === 'Completed'

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col -mx-4 -mt-6 sm:-mx-8 lg:-mx-12 lg:-mt-10">

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12 border-b border-border bg-canvas shrink-0">
        <div>
          <h1 className="text-[16px] font-semibold text-ink">AI Workspace Assistant</h1>
          <p className="text-[13px] text-ink-soft mt-0.5">Ask questions grounded in your project data.</p>
        </div>
        <div className="flex items-center gap-3">
          {chatMessages.length > 0 && (
            <button 
              onClick={clearChat}
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-surface text-[13px] font-medium text-ink shadow-flat hover:border-danger hover:text-danger hover:bg-danger/10 transition-all"
              title="Clear Chat"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <span className="text-[13px] font-medium text-ink-soft">Context:</span>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-ink shadow-flat focus:outline-none focus:ring-2 focus:ring-accent-soft focus:border-accent transition-all cursor-pointer hover:border-border-strong"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto bg-canvas pb-8">
        {!isCompleted ? (
          <div className="flex h-full items-center justify-center p-6">
            <EmptyState
              icon={Sparkles}
              title="Analysis Required"
              description="Analyze this project first to start chatting with your customer research."
              actionLabel="Go to Analysis"
              onAction={() => window.location.href = `/analysis/${project}`}
            />
          </div>
        ) : (
          <div className="pt-4">
            {chatMessages.map((m) => (
              <MessageRow key={m.id} role={m.role} text={m.text} />
            ))}
            {thinking && (
              <div className="flex gap-4 max-w-4xl mx-auto w-full px-4 py-6 bg-surface border-y border-border">
                <div className="shrink-0 mt-1">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
                    <Sparkles className="size-4" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink mb-1.5">InsightFlow AI</p>
                  <div className="flex items-center gap-2.5 text-[13.5px] text-ink-soft mt-2">
                    <LoadingSpinner size="sm" />
                    <span>Analyzing sources...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-canvas border-t border-border shrink-0">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-3 flex flex-wrap gap-2">
            {['Summarize the project', 'What are the main pain points?'].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-border-strong hover:text-ink transition-colors shadow-flat"
              >
                <Sparkles className="size-3 text-accent" strokeWidth={2.5} />
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-end gap-3 rounded-2xl border border-border bg-surface p-3 pl-4 shadow-sm focus-within:ring-4 focus-within:ring-accent-soft focus-within:border-accent transition-all"
          >
            <button type="button" className="mb-2 flex size-6 shrink-0 items-center justify-center text-ink-faint hover:text-ink transition-colors" aria-label="Attach file">
              <Paperclip className="size-[18px]" strokeWidth={2} />
            </button>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              rows={1}
              disabled={!isCompleted}
              placeholder="Ask anything about the active project..."
              className="max-h-32 flex-1 resize-none bg-transparent py-2 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!draft.trim() || !isCompleted || thinking}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-flat transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
              aria-label="Send message"
            >
              <Send className="size-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
