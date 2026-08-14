import { useState } from "react";

function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7.5 12.3 2.9 2.9 6.3-6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function EditIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14.7 5.2 4.1 4.1M5.2 18.8l2.2-5.1L15.8 5.3a2.9 2.9 0 0 1 4.1 4.1l-8.4 8.4-5.1 2.2-1.2-1.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TrashIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 7h15M10 11v5M14 11v5M9 7l.7-2h4.6l.7 2M6.5 7l.7 11h9.6l.7-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Todolist({ todos, filter, onToggle, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", description: "", priority: "medium" });

  const openEditor = (todo) => {
    setDraft({ title: todo.title, description: todo.description, priority: todo.priority });
    setEditingId(todo.id);
  };

  const saveEditor = (event, id) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onUpdate(id, { title: draft.title.trim(), description: draft.description.trim() || "No details added yet.", priority: draft.priority });
    setEditingId(null);
  };

  if (!todos.length) return <section className="empty-state"><span className="empty-check"><CheckIcon /></span><h2>{filter === "completed" ? "No completed tasks yet" : filter === "pending" ? "No pending tasks" : "Your list is clear"}</h2><p>{filter === "completed" ? "Finish a task and it will show up here." : "Take a breath, then add your next meaningful task."}</p></section>;

  return <div className="task-list">
    {todos.map((todo) => editingId === todo.id ? <form className="task task-editor" key={todo.id} onSubmit={(event) => saveEditor(event, todo.id)}>
      <div className="editor-fields"><input value={draft.title} onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))} aria-label="Edit task title" maxLength="120" autoFocus /><textarea value={draft.description} onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))} aria-label="Edit task details" maxLength="180" /></div>
      <select value={draft.priority} onChange={(event) => setDraft((value) => ({ ...value, priority: event.target.value }))} aria-label="Edit task priority"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
      <div className="editor-actions"><button type="button" onClick={() => setEditingId(null)}>Cancel</button><button type="submit">Save</button></div>
    </form> : <article className={todo.status ? "task completed" : "task"} key={todo.id}>
      <button className="check-button" onClick={() => onToggle(todo.id)} aria-label={todo.status ? `Mark ${todo.title} as pending` : `Mark ${todo.title} as complete`}>{todo.status && <CheckIcon />}</button>
      <div className="task-copy"><h3>{todo.title}</h3><p>{todo.description}</p></div>
      <span className={`priority-pill ${todo.priority}`}>{todo.priority}</span>
      <div className="task-actions"><button onClick={() => openEditor(todo)} aria-label={`Edit ${todo.title}`} title="Edit task"><EditIcon /></button><button className="delete-task" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`} title="Delete task"><TrashIcon /></button></div>
    </article>)}
  </div>;
}

export default Todolist;
