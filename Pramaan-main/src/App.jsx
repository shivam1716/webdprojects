import React, { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProjectsListView from './components/ProjectsListView';
import ProjectDetailView from './components/ProjectDetailView';
import EvidenceWallView from './components/EvidenceWallView';
import ProjectMap from './components/ProjectMap';
import SourceModal from './components/SourceModal';

import ImpactStoryModal from './components/ImpactStoryModal';
import LiveDemoTour from './components/LiveDemoTour';
import LoginView from './components/LoginView';
import EvidenceGapCard from './components/EvidenceGapCard';
import EvidenceMapView from './components/EvidenceMapView';

import { worldBankService } from './services/worldBankService';
import { cloudinaryService } from './services/cloudinaryService';
import { evidenceService } from './services/evidenceService';

export default function App() {
  // Persist auth across page refreshes
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return localStorage.getItem('pramaan_auth') === 'true'; } catch { return false; }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pramaan_user');
      return saved ? JSON.parse(saved) : { name: 'Rajni', role: 'Lead Evidence Auditor' };
    } catch { return { name: 'Rajni', role: 'Lead Evidence Auditor' }; }
  });
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectMedia, setProjectMedia] = useState([]);
  const [projectObservations, setProjectObservations] = useState([]);
  const [projectGaps, setProjectGaps] = useState([]);
  const [projectCoverage, setProjectCoverage] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [sourceModalData, setSourceModalData] = useState(null);

  const [activeImpactStory, setActiveImpactStory] = useState(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial Load from real data sources
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedProjects = await worldBankService.getProjects({ countryCode: 'IN', rows: 15 });
      setProjects(fetchedProjects);

      const media = await cloudinaryService.getAllMedia();
      setAllMedia(media);

      if (fetchedProjects.length > 0) {
        const defaultProj = fetchedProjects[0];
        setSelectedProjectId(defaultProj.id);
        setCurrentProject(defaultProj);
        
        const pMedia = await cloudinaryService.getProjectMedia(defaultProj.id);
        setProjectMedia(pMedia);

        const obs = await evidenceService.getProjectObservations(defaultProj);
        setProjectObservations(obs);

        const gaps = await evidenceService.detectEvidenceGaps(defaultProj);
        setProjectGaps(gaps);

        const cov = await evidenceService.calculateEvidenceCoverage(defaultProj);
        setProjectCoverage(cov);
      }
    } catch (err) {
      console.error('Failed to load initial live datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update when selected project changes
  const handleSelectProject = async (projId) => {
    setSelectedProjectId(projId);
    const proj = projects.find(p => p.id === projId) || await worldBankService.getProject(projId);
    if (proj) {
      setCurrentProject(proj);
      const pMedia = await cloudinaryService.getProjectMedia(proj.id);
      setProjectMedia(pMedia);

      const obs = await evidenceService.getProjectObservations(proj);
      setProjectObservations(obs);

      const gaps = await evidenceService.detectEvidenceGaps(proj);
      setProjectGaps(gaps);

      const cov = await evidenceService.calculateEvidenceCoverage(proj);
      setProjectCoverage(cov);

      setCurrentView('project_detail');
    }
  };

  const handleCreateImpactStory = async (proj) => {
    const target = proj || currentProject;
    if (!target) return;
    const story = await evidenceService.generateImpactStory(target);
    setActiveImpactStory(story);
  };

  // Aggregated dynamic metrics
  const totalFunding = projects.reduce((acc, p) => acc + (p.commitmentAmount || 0), 0);
  const allLocations = projects.flatMap(p => p.locations || []);
  const distinctLocationsCount = new Set(allLocations.map(l => l.name)).size;

  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <LoginView onLoginSuccess={(userData) => {
          try {
            localStorage.setItem('pramaan_auth', 'true');
            localStorage.setItem('pramaan_user', JSON.stringify(userData));
          } catch {}
          setUser(userData);
          setIsAuthenticated(true);
        }} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col font-sans selection:bg-[#C8754A]/20">
      {/* Premium Cursor with trailing shadow & orbiting satellite dot (Preserved as requested) */}
      <CustomCursor />

      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            setMobileMenuOpen(false);
          }}
        />

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 md:hidden flex">
            <div className="w-64 bg-[#191815] h-full p-4 border-r border-[#2C2822]">
              <div className="flex justify-between items-center mb-6">
                <span className="font-serif font-bold text-[#EEE7DA]">PRAMAAN</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#918A7D]">✕</button>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {['home', 'projects', 'evidence', 'map', 'reports'].map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      setCurrentView(v);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded uppercase ${currentView === v ? 'bg-[#C8754A] text-[#11110F] font-bold' : 'text-[#918A7D]'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onStartDemo={() => setIsDemoOpen(true)}
            onOpenSourceDetails={(data) => setSourceModalData(data)}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            onSignOut={() => {
              try {
                localStorage.removeItem('pramaan_auth');
                localStorage.removeItem('pramaan_user');
              } catch {}
              setIsAuthenticated(false);
            }}
            onNavigate={(view) => { setCurrentView(view); setMobileMenuOpen(false); }}
            user={user}
          />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#C8754A] border-t-transparent animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#918A7D]">
                  Fetching World Bank API Data...
                </span>
              </div>
            ) : (
              <>
                {/* 1. HOME DASHBOARD VIEW */}
                {currentView === 'home' && (
                  <DashboardView
                    projects={projects}
                    allMedia={allMedia}
                    totalFunding={totalFunding}
                    locationsCount={distinctLocationsCount}
                    onSelectProject={handleSelectProject}
                    onCreateImpactStory={handleCreateImpactStory}
                    onOpenSourceDetails={(data) => setSourceModalData(data)}
                  />
                )}

                {/* 2. PROJECTS LIST VIEW */}
                {currentView === 'projects' && (
                  <ProjectsListView
                    projects={projects}
                    allMedia={allMedia}
                    onSelectProject={handleSelectProject}
                    onOpenSourceDetails={(data) => setSourceModalData(data)}
                    globalSearch={searchQuery}
                  />
                )}

                {/* 3. PROJECT DETAIL VIEW */}
                {currentView === 'project_detail' && currentProject && (
                  <ProjectDetailView
                    project={currentProject}
                    mediaList={projectMedia}
                    observations={projectObservations}
                    gaps={projectGaps}
                    coverage={projectCoverage}
                    onBack={() => setCurrentView('projects')}
                    onCreateImpactStory={handleCreateImpactStory}
                    onOpenSourceDetails={(data) => setSourceModalData(data)}
                    onRequestEvidence={(gap) => {
                      alert(`Field inspection telemetry request logged for ${gap.targetEntity}. Task queued for regional field inspection team.`);
                    }}
                  />
                )}

                {/* 4. EVIDENCE WALL VIEW */}
                {currentView === 'evidence' && (
                  <EvidenceWallView
                    mediaList={allMedia}
                    isConnected={cloudinaryService.isConfigured()}
                    onSelectProject={handleSelectProject}
                    onOpenSourceDetails={(data) => setSourceModalData(data)}
                  />
                )}

                {/* 5. GEOSPATIAL MAP VIEW (Exact match to bottom-right of screenshot) */}
                {currentView === 'map' && (
                  <EvidenceMapView onSelectProject={handleSelectProject} />
                )}

                {/* 6. REPORTS & AUDIT GAPS VIEW */}
                {currentView === 'reports' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#2C2822]">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#C8754A] uppercase font-semibold">
                          Audit Intelligence
                        </span>
                        <h2 className="text-xl font-serif font-bold text-[#EEE7DA]">
                          Evidence Gap Detector & Compliance
                        </h2>
                      </div>
                      <button
                        onClick={() => handleCreateImpactStory(currentProject)}
                        className="px-4 py-2 rounded-lg bg-[#C8754A] hover:bg-[#C8754A]/90 text-[#EEE7DA] text-xs font-mono uppercase tracking-wider font-semibold"
                        data-cursor="target"
                      >
                        Create Impact Story
                      </button>
                    </div>

                    <EvidenceGapCard
                      gaps={projectGaps}
                      onRequestEvidence={(gap) => {
                        alert(`Photographic audit request dispatched for: ${gap.targetEntity}`);
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <SourceModal
        isOpen={Boolean(sourceModalData)}
        onClose={() => setSourceModalData(null)}
        data={sourceModalData}
      />

      <ImpactStoryModal
        isOpen={Boolean(activeImpactStory)}
        onClose={() => setActiveImpactStory(null)}
        story={activeImpactStory}
        onOpenSourceDetails={(data) => setSourceModalData(data)}
      />

      <LiveDemoTour
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNavigateView={(v) => setCurrentView(v)}
        onGenerateReport={handleCreateImpactStory}
      />
    </div>
  );
}
