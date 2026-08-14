import { useState } from "react";

function TodoInput({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showDetails, setShowDetails] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setShowDetails(false);
  };

  return <form className="todo-input" onSubmit={submit}>
    <div className="input-main-row">
      <input value={title} onChange={(event) => setTitle(event.target.value)} type="text" placeholder="What needs to be done?" aria-label="New task title" maxLength="120" autoComplete="off" />
      <button type="submit" className="add-task-button">Add Task <span aria-hidden="true">+</span></button>
    </div>
    <div className="input-options">
      <button className="details-toggle" type="button" onClick={() => setShowDetails((value) => !value)} aria-expanded={showDetails}><span>{showDetails ? "-" : "+"}</span> Add details</button>
      <label className="priority-select">Priority <select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Task priority"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
    </div>
    {showDetails && <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="new-task-details" placeholder="Add a short note or next step (optional)" maxLength="180" aria-label="Task details" />}
  </form>;
}

export { TodoInput };
