import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LehrField from '../components/LehrField';
import { useApp } from '../context/AppContext';

function ParakhMark() {
  return (
    <div className="parakh-mark" aria-hidden="true">
      <span className="parakh-mark-a" />
      <span className="parakh-mark-b" />
    </div>
  );
}

export default function Login() {
  const nav = useNavigate();
  const { login } = useApp();
  const [role, setRole] = useState('Ops Analyst');
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);
  const [logging, setLogging] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLogging(true);
    setTimeout(() => {
      login(name || 'Parakh User', role);
      nav('/');
    }, 650);
  };

  return (
    <main className="login-page">
      <LehrField particleCount={320} speed={0.18} ringMode cursorSatellite />
      <div className="login-vignette" />

      <header className="login-header">
        <div className="brand-lockup">
          <ParakhMark />
          <span className="brand-name serif">Parakh</span>
          <span className="brand-divider" />
          <span className="brand-subtitle">Merchant Intelligence Platform</span>
        </div>
        <nav className="login-nav" aria-label="Product themes">
          <span>Better Data</span><i>/</i><span>Fairer Markets</span><i>/</i><span>Stronger Ecosystems</span>
        </nav>
      </header>

      <div className="login-grid">
        <section className="login-copy">
          <div className="eyebrow text-gold">Parakh&nbsp;&nbsp;/&nbsp;&nbsp; Merchant intelligence</div>
          <h1 className="serif login-title">
            Like gold,<br />
            every score is <span>assayed.</span>
          </h1>
          <p className="login-lead">Every score, tested against real transactions.</p>
          <p className="login-note">Knows the best. Finds the fraud. Helps honest<br className="hidden sm:block" /> merchants grow.</p>
        </section>

        <motion.form
          initial={{ opacity: 0, x: 28, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={submit}
          className={`login-card ${logging ? 'is-testing' : ''}`}
        >
          <div className="login-card-head">
            <div>
              <h2 className="serif">Enter Parakh</h2>
              <p>Mock workspace login</p>
            </div>
            <div className="login-icon"><UserRound size={22} strokeWidth={1.4} /></div>
          </div>
          <div className="login-rule" />

          <label className="login-field">
            <span>Your name</span>
            <div className="login-input-wrap">
              <UserRound size={18} strokeWidth={1.35} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Arvind Singh" />
            </div>
          </label>

          <label className="login-field">
            <span>Email</span>
            <div className="login-input-wrap">
              <Mail size={18} strokeWidth={1.35} />
              <input defaultValue="ops@parakh.in" type="email" />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div className="login-input-wrap">
              <LockKeyhole size={18} strokeWidth={1.35} />
              <input type={show ? 'text' : 'password'} defaultValue="parakh" />
              <button type="button" className="field-icon-button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff size={18} strokeWidth={1.35} /> : <Eye size={18} strokeWidth={1.35} />}
              </button>
            </div>
          </label>

          <label className="login-field">
            <span>Role</span>
            <div className="login-input-wrap select-wrap">
              <UserRound size={18} strokeWidth={1.35} />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Ops Analyst</option>
                <option>Merchant</option>
                <option>Lender</option>
              </select>
              <span className="select-arrow">⌄</span>
            </div>
          </label>

          <button disabled={logging} className="login-submit">
            <span>{logging ? 'Testing score…' : 'Open workspace'}</span>
            <ArrowRight size={19} strokeWidth={1.4} />
          </button>
          <p className="login-footnote">Your name appears across the workspace after login.</p>
        </motion.form>
      </div>

      <footer className="login-footer">
        <div><b /> REAL DATA <i>/</i> REAL RISK <i>/</i> REAL OPPORTUNITY</div>
        <div>SCROLL TO EXPLORE <span className="footer-orbit" /></div>
      </footer>
    </main>
  );
}
