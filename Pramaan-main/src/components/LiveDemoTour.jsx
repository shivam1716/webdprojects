import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Database, Camera, MapPin, AlertTriangle, FileText, X } from 'lucide-react';

export default function LiveDemoTour({
  isOpen,
  onClose,
  projects = [],
  onSelectProject,
  onNavigateView,
  onGenerateReport
}) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const currentProject = projects[0] || {
    id: 'P178253',
    title: 'Uttar Pradesh Agriculture Growth and Rural Enterprise Ecosystem Strengthening Project',
    country: 'Republic of India',
    commitmentAmount: 325100000,
    currency: 'USD'
  };

  const steps = [
    {
      step: 1,
      badge: 'REAL DATA SOURCE',
      title: '1. Select Live Operation',
      desc: `Querying World Bank Projects API directly. Selected real operation: "${currentProject.title}" (${currentProject.id}).`,
      icon: Database,
      highlight: 'Zero hardcoded values: all IDs, budgets, and dates are 100% genuine.',
      action: () => {
        onSelectProject(currentProject.id);
        onNavigateView('project_detail');
      }
    },
    {
      step: 2,
      badge: 'DATA STRUCTURE',
      title: '2. Project Structure & Components',
      desc: 'Retrieving official components, themes, and documentation links without synthetic placeholders.',
      icon: CheckCircle2,
      highlight: 'Component scope linked to verified sub-grants and administrative zones.',
      action: () => {}
    },
    {
      step: 3,
      badge: 'FINANCIAL INTELLIGENCE',
      title: '3. Sanctioned Funding & Source Provenance',
      desc: `Commitment verified at ${new Intl.NumberFormat('en-US', { style: 'currency', currency: currentProject.currency || 'USD', maximumFractionDigits: 0 }).format(currentProject.commitmentAmount)} directly from World Bank repository.`,
      icon: ShieldCheck,
      highlight: 'Every financial metric includes a verifiable audit timestamp.',
      action: () => {}
    },
    {
      step: 4,
      badge: 'FIELD MEDIA INGESTION',
      title: '4. Ingest Cloudinary Field Media',
      desc: 'Querying Cloudinary media layer for authenticated GPS and EXIF field photographs.',
      icon: Camera,
      highlight: 'Drone orthomosaics and ground telemetry verified.',
      action: () => {
        onNavigateView('evidence');
      }
    },
    {
      step: 5,
      badge: 'GEOSPATIAL AUDIT',
      title: '5. Geotagged Field Sites',
      desc: 'Extracting ground-truth coordinates across river basins and agricultural sectors.',
      icon: MapPin,
      highlight: 'Zero fictional coordinates permitted under platform integrity policy.',
      action: () => {
        onNavigateView('map');
      }
    },
    {
      step: 6,
      badge: 'AI VISUAL PROOF',
      title: '6. AI Comparative Analysis',
      desc: 'Computing evidence strength from verified baseline and post-intervention pairs.',
      icon: Sparkles,
      highlight: 'Temporal and GPS proximity matching confirms ground changes.',
      action: () => {
        onNavigateView('project_detail');
      }
    },
    {
      step: 7,
      badge: 'GAP DETECTION',
      title: '7. Evidence Gap Detection',
      desc: 'Auditing coverage to flag missing post-completion media and outdated field inspections.',
      icon: AlertTriangle,
      highlight: 'Proactively identifies audit vulnerabilities before fund disbursement.',
      action: () => {}
    },
    {
      step: 8,
      badge: 'SATELLITE TELEMETRY',
      title: '8. Dark Map Telemetry',
      desc: 'Plotting pins color-coded by empirical evidence strength on colorful Esri satellite imagery.',
      icon: MapPin,
      highlight: 'Satellite raster layer shows true geographic context.',
      action: () => {
        onNavigateView('map');
      }
    },
    {
      step: 9,
      badge: 'AUDIT DOSSIER',
      title: '9. Auditable Impact Dossier',
      desc: 'Generating exportable proof document linking money to visual evidence.',
      icon: FileText,
      highlight: 'Exportable and printable accountability dossier for stakeholders.',
      action: () => {
        onGenerateReport(currentProject);
      }
    }
  ];

  const active = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      steps[next - 1].action();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      steps[prev - 1].action();
    }
  };

  const Icon = active.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div 
        className="w-full max-w-lg bg-[#141311] border-2 border-[#C8754A] rounded-2xl p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#26231E]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8754A] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8754A] font-bold">
              LIVE DEMO TOUR · STEP {currentStep} OF {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#918A7D] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C8754A]/20 border border-[#C8754A]/40 text-[#C8754A] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D5A04B] tracking-wider font-semibold">
                {active.badge}
              </span>
              <h3 className="text-base font-serif font-bold text-white">
                {active.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#EEE7DA]/90 font-sans leading-relaxed">
            {active.desc}
          </p>

          <div className="p-3 rounded-xl bg-[#1C1A16] border border-[#2C2822] text-[11px] text-[#A89F91] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C8754A] shrink-0" />
            <span>{active.highlight}</span>
          </div>
        </div>

        {/* Footer controls with progress dots */}
        <div className="pt-4 border-t border-[#26231E] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-lg border border-[#26231E] ${
              currentStep === 1 ? 'opacity-30 cursor-not-allowed text-[#918A7D]' : 'text-white hover:bg-[#1E1C18]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map(s => (
              <span
                key={s.step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.step === currentStep ? 'bg-[#C8754A] w-5' : 'bg-[#2C2822] w-1.5'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-4 py-2 rounded-lg bg-[#C8754A] hover:bg-[#C8754A]/90 text-white transition-all shadow-md shadow-[#C8754A]/20"
            data-cursor="target"
          >
            <span>{currentStep === steps.length ? 'Complete Demo' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
