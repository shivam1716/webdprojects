import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import PramaanLogo from './PramaanLogo';

/* ---------- helpers ---------- */
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too short', color: '#E57373' },
    { label: 'Weak', color: '#E57373' },
    { label: 'Fair', color: '#FBBC05' },
    { label: 'Good', color: '#66BB6A' },
    { label: 'Strong', color: '#66BB6A' },
  ];
  return { score, ...map[score] };
}

const ROLES = [
  'Lead Evidence Auditor',
  'Field Inspector',
  'Data Analyst',
  'Project Manager',
  'Policy Researcher',
  'Observer / Viewer',
];

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"/>
  </svg>
);

/* ---------- shared field component ---------- */
function Field({ label, children, error }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-[#918A7D] mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1 text-[10px] text-[#E57373]">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Left decorative panel ---------- */
function LeftPanel({ isSignup }) {
  return (
    <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-screen bg-black overflow-hidden flex flex-col justify-between p-8 md:p-12">
      <img
        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop"
        alt="Environmental Field Inspection"
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-black/40 to-black/60 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C8754A]/20 border border-[#C8754A]/40 flex items-center justify-center">
            <PramaanLogo className="w-7 h-7" color="#C8754A" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-wider text-[#EEE7DA]">PRAMAAN</h1>
            <p className="text-[11px] font-mono text-[#D5A04B] tracking-wide">Follow the money. Find the proof.</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs font-serif italic text-[#EEE7DA] leading-snug">
            Real projects.<br />Real people.<br />Real impact.
          </div>
        </div>
      </div>

      {/* Dynamic caption based on mode */}
      <div className="relative z-10 max-w-md my-auto md:my-0 space-y-3">
        {isSignup ? (
          <>
            <p className="text-lg font-serif font-semibold text-[#EEE7DA] leading-snug">
              Join the evidence revolution.
            </p>
            <p className="text-xs font-mono text-[#918A7D] leading-relaxed">
              Create your secure audit workspace and start connecting funding data, field photography, and ground truth — all in one place.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {['Verified evidence trails', 'Real-time World Bank data', 'Field photo intelligence'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8754A] flex-shrink-0" />
                  <span className="text-[11px] font-mono text-[#918A7D]">{f}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs font-mono text-[#918A7D] leading-relaxed">
            The evidence intelligence platform connecting global development funding, field photography, and visual ground truth in one auditable workspace.
          </p>
        )}
      </div>

      <div className="relative z-10 text-[10px] font-mono text-[#918A7D]/70 hidden md:block">
        PRAMAAN DATA INTELLIGENCE · SECURE AUDIT WORKSPACE
      </div>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */
export default function LoginView({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'success'

  // --- Login state ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // --- Signup state ---
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState(ROLES[0]);
  const [signupOrg, setSignupOrg] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [createdUser, setCreatedUser] = useState(null);

  const pwStrength = passwordStrength(signupPassword);

  /* ---- Login submit ---- */
  const handleLogin = (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginEmail.trim()) errs.email = 'Email is required';
    if (!loginPassword.trim()) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    const name = loginEmail.split('@')[0];
    const formatted = name.charAt(0).toUpperCase() + name.slice(1);
    onLoginSuccess?.({ name: formatted, email: loginEmail, role: 'Lead Evidence Auditor' });
  };

  /* ---- Google login ---- */
  const handleGoogle = () => {
    onLoginSuccess?.({ name: 'Rajni', email: 'rajni@gmail.com', role: 'Verified Google Auditor' });
  };

  /* ---- Signup submit ---- */
  const handleSignup = (e) => {
    e.preventDefault();
    const errs = {};
    if (!signupName.trim()) errs.name = 'Full name is required';
    if (!signupEmail.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.email = 'Enter a valid email';
    if (!signupPassword) errs.password = 'Password is required';
    else if (signupPassword.length < 6) errs.password = 'Minimum 6 characters';
    if (signupConfirm !== signupPassword) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setSignupErrors({});
    const newUser = {
      name: signupName.trim().charAt(0).toUpperCase() + signupName.trim().slice(1),
      email: signupEmail,
      role: signupRole,
      org: signupOrg,
    };
    setCreatedUser(newUser);
    setMode('success');
  };

  /* ---- Switch helper ---- */
  const switchMode = (m) => {
    setLoginErrors({});
    setSignupErrors({});
    setMode(m);
  };

  const isSignup = mode === 'signup';
  const isSuccess = mode === 'success';

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#11110F] text-[#EEE7DA] overflow-hidden select-none">
      <LeftPanel isSignup={isSignup} />

      {/* RIGHT COLUMN */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center p-8 md:p-14 bg-[#11110F] overflow-y-auto">
        {/* Ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #9A7BB8 0%, #D77A8B 50%, transparent 70%)' }}
        />

        <div className="w-full max-w-sm relative z-10">

          {/* =================== SUCCESS STATE =================== */}
          {isSuccess && createdUser && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#66BB6A]/10 border border-[#66BB6A]/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#66BB6A]" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#EEE7DA]">Account created!</h2>
                <p className="text-xs text-[#918A7D] mt-1.5">
                  Welcome to Pramaan, <span className="text-[#C8754A] font-semibold">{createdUser.name}</span>.
                  Your audit workspace is ready.
                </p>
              </div>
              <div className="bg-[#191815] border border-[#2C2822] rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#918A7D] font-mono">Name</span>
                  <span className="text-[#EEE7DA] font-medium">{createdUser.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#918A7D] font-mono">Email</span>
                  <span className="text-[#EEE7DA]">{createdUser.email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#918A7D] font-mono">Role</span>
                  <span className="text-[#C8754A] font-semibold">{createdUser.role}</span>
                </div>
                {createdUser.org && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[#918A7D] font-mono">Organisation</span>
                    <span className="text-[#EEE7DA]">{createdUser.org}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onLoginSuccess?.(createdUser)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#C8754A] hover:bg-[#B8643A] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* =================== LOGIN FORM =================== */}
          {mode === 'login' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#EEE7DA]">Welcome back</h2>
                <p className="text-xs text-[#918A7D] mt-1">Sign in to continue your impact journey.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5" noValidate>
                <Field label="Email address" error={loginErrors.email}>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginErrors(p => ({ ...p, email: '' })); }}
                    placeholder="name@organization.org"
                    className={`w-full px-3.5 py-2 rounded-lg bg-[#191815] border text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none transition-colors ${loginErrors.email ? 'border-[#E57373]' : 'border-[#2C2822] focus:border-[#C8754A]'}`}
                    data-cursor="target"
                  />
                </Field>

                <Field label="Password" error={loginErrors.password}>
                  <div className="relative">
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => { setLoginPassword(e.target.value); setLoginErrors(p => ({ ...p, password: '' })); }}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-2 rounded-lg bg-[#191815] border text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none transition-colors pr-10 ${loginErrors.password ? 'border-[#E57373]' : 'border-[#2C2822] focus:border-[#C8754A]'}`}
                      data-cursor="target"
                    />
                    <button type="button" onClick={() => setShowLoginPw(v => !v)} className="absolute right-3 top-2 text-[#918A7D] hover:text-[#EEE7DA]">
                      {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button type="button" className="text-[10px] text-[#C8754A] hover:underline font-mono">Forgot password?</button>
                  </div>
                </Field>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#C8754A] hover:bg-[#B8643A] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8754A]/10 active:scale-[0.99]"
                  data-cursor="target"
                >
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#2C2822]" />
                <span className="px-3 text-[11px] font-mono text-[#918A7D] uppercase">or</span>
                <div className="flex-1 border-t border-[#2C2822]" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full py-2.5 px-4 rounded-lg bg-[#191815] hover:bg-[#211F1B] border border-[#2C2822] text-xs text-[#EEE7DA] flex items-center justify-center gap-2.5 transition-colors"
                data-cursor="target"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* Switch to signup */}
              <p className="text-center text-xs text-[#918A7D]">
                New to Pramaan?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#C8754A] hover:underline font-semibold"
                  data-cursor="target"
                >
                  Create an account
                </button>
              </p>
            </div>
          )}

          {/* =================== SIGNUP FORM =================== */}
          {mode === 'signup' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Back button */}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="flex items-center gap-1.5 text-[11px] font-mono text-[#918A7D] hover:text-[#EEE7DA] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </button>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-[#EEE7DA] flex items-center gap-2">
                  Create account
                  <UserPlus className="w-5 h-5 text-[#C8754A]" />
                </h2>
                <p className="text-xs text-[#918A7D] mt-1">Set up your secure evidence audit workspace.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-3" noValidate>
                <Field label="Full name" error={signupErrors.name}>
                  <input
                    type="text"
                    value={signupName}
                    onChange={e => { setSignupName(e.target.value); setSignupErrors(p => ({ ...p, name: '' })); }}
                    placeholder="Your full name"
                    className={`w-full px-3.5 py-2 rounded-lg bg-[#191815] border text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none transition-colors ${signupErrors.name ? 'border-[#E57373]' : 'border-[#2C2822] focus:border-[#C8754A]'}`}
                    data-cursor="target"
                  />
                </Field>

                <Field label="Email address" error={signupErrors.email}>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={e => { setSignupEmail(e.target.value); setSignupErrors(p => ({ ...p, email: '' })); }}
                    placeholder="name@organization.org"
                    className={`w-full px-3.5 py-2 rounded-lg bg-[#191815] border text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none transition-colors ${signupErrors.email ? 'border-[#E57373]' : 'border-[#2C2822] focus:border-[#C8754A]'}`}
                    data-cursor="target"
                  />
                </Field>

                {/* Role selector */}
                <Field label="Your role">
                  <select
                    value={signupRole}
                    onChange={e => setSignupRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#191815] border border-[#2C2822] text-xs text-[#EEE7DA] focus:outline-none focus:border-[#C8754A] transition-colors"
                    data-cursor="target"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>

                {/* Organisation (optional) */}
                <Field label="Organisation (optional)">
                  <input
                    type="text"
                    value={signupOrg}
                    onChange={e => setSignupOrg(e.target.value)}
                    placeholder="World Bank, NGO, Government..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#191815] border border-[#2C2822] text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none focus:border-[#C8754A] transition-colors"
                    data-cursor="target"
                  />
                </Field>

                {/* Password + strength */}
                <Field label="Password" error={signupErrors.password}>
                  <div className="relative">
                    <input
                      type={showSignupPw ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={e => { setSignupPassword(e.target.value); setSignupErrors(p => ({ ...p, password: '' })); }}
                      placeholder="Min. 6 characters"
                      className={`w-full px-3.5 py-2 rounded-lg bg-[#191815] border text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none transition-colors pr-10 ${signupErrors.password ? 'border-[#E57373]' : 'border-[#2C2822] focus:border-[#C8754A]'}`}
                      data-cursor="target"
                    />
                    <button type="button" onClick={() => setShowSignupPw(v => !v)} className="absolute right-3 top-2 text-[#918A7D] hover:text-[#EEE7DA]">
                      {showSignupPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {signupPassword.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="flex-1 h-0.5 rounded-full transition-all duration-300"
                            style={{ background: i <= pwStrength.score ? pwStrength.color : '#2C2822' }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </span>
                    </div>
                  )}
                </Field>

                {/* Confirm password */}
                <Field label="Confirm password" error={signupErrors.confirm}>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={signupConfirm}
                      onChange={e => { setSignupConfirm(e.target.value); setSignupErrors(p => ({ ...p, confirm: '' })); }}
                      placeholder="Re-enter password"
                      className={`w-full px-3.5 py-2 rounded-lg bg-[#191815] border text-xs text-[#EEE7DA] placeholder-[#918A7D]/50 focus:outline-none transition-colors pr-10 ${signupErrors.confirm ? 'border-[#E57373]' : 'border-[#2C2822] focus:border-[#C8754A]'}`}
                      data-cursor="target"
                    />
                    <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="absolute right-3 top-2 text-[#918A7D] hover:text-[#EEE7DA]">
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {signupConfirm && signupPassword === signupConfirm && (
                      <CheckCircle2 className="absolute right-9 top-2 w-4 h-4 text-[#66BB6A]" />
                    )}
                  </div>
                </Field>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#C8754A] hover:bg-[#B8643A] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8754A]/10 active:scale-[0.99] mt-1"
                  data-cursor="target"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create account</span>
                </button>
              </form>

              {/* Divider + Google signup */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#2C2822]" />
                <span className="px-3 text-[11px] font-mono text-[#918A7D] uppercase">or</span>
                <div className="flex-1 border-t border-[#2C2822]" />
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full py-2.5 px-4 rounded-lg bg-[#191815] hover:bg-[#211F1B] border border-[#2C2822] text-xs text-[#EEE7DA] flex items-center justify-center gap-2.5 transition-colors"
                data-cursor="target"
              >
                <GoogleIcon />
                <span>Sign up with Google</span>
              </button>

              {/* Switch to login */}
              <p className="text-center text-xs text-[#918A7D]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#C8754A] hover:underline font-semibold"
                  data-cursor="target"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
