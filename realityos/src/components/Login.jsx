import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onLogin({ name: name.trim(), email: email.trim() });
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-mark"><Sparkles size={24} /></div>
        <span className="eyebrow">WELCOME TO REALITYOS</span>
        <h1>Make the everyday actionable.</h1>
        <p>Sign in to save your preferences and continue your visual workspace.</p>
        <label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" required /></label>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
        <button className="login-button" type="submit">Continue <ArrowRight size={17} /></button>
        <small>This demo stores your session only in this browser.</small>
      </form>
    </main>
  );
}
