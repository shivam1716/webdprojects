import { CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <section className="preferences-page">
      <div className="page-intro"><div className="ai-large-icon"><ShieldCheck size={24} /></div><span className="eyebrow">YOUR DATA</span><h2>Privacy centre</h2><p>Clear information about how RealityOS handles your scans and personal context.</p></div>
      <div className="preference-list">
        <PrivacyRow icon={LockKeyhole} title="Private processing" text="Your images stay in this browser session and are not uploaded by this demo." />
        <PrivacyRow icon={CheckCircle2} title="Control your context" text="Memory and history are visible only to the signed-in profile on this device." />
        <PrivacyRow icon={ShieldCheck} title="Session protection" text="Sign out at any time from Settings to remove the saved local session." />
      </div>
    </section>
  );
}

function PrivacyRow({ icon: Icon, title, text }) {
  return <article className="preference-card"><div className="preference-icon"><Icon size={20} /></div><div><h3>{title}</h3><p>{text}</p></div></article>;
}
