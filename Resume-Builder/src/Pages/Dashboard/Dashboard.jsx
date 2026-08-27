import React, { useContext } from 'react';
import { Badge, Button } from '@chakra-ui/react';
import { FiFileText, FiLayout, FiDownload, FiArrowRight } from 'react-icons/fi';
import ResumeContext from '../../Context/ResumeContext';
import ThemeTemplateData from '../../db/ThemeTemplateData';
import WorkspaceSidebar from '../../Components/WorkspaceSidebar/WorkspaceSidebar';
import './dashboard.css';

const templateNames = ['Modern', 'Professional', 'Creative', 'Minimal'];
export default function Dashboard() {
  const { selectBtn, setSelectBtn, setCurrentTheme, setShowComponent } = useContext(ResumeContext);
  const chooseTemplate = (id) => { setCurrentTheme(id); setShowComponent(true); };
  return <div className="workspace-layout"><WorkspaceSidebar active={selectBtn ? 'Dashboard' : 'Templates'} /><main className="workspace-main">
    {selectBtn ? <><header className="dashboard-top"><div><Badge colorScheme="teal">Resume workspace</Badge><h1>Create your <span>professional resume</span></h1><p>Build a job-ready resume in a focused, step-by-step workspace.</p></div><Button colorScheme="teal" leftIcon={<FiFileText />} onClick={() => setSelectBtn(false)}>Create new resume</Button></header><section className="metric-grid"><article><span className="metric-icon cyan"><FiFileText /></span><div><small>Resumes created</small><strong>1</strong><em>This month</em></div></article><article><span className="metric-icon blue"><FiLayout /></span><div><small>Templates</small><strong>5</strong><em>Professional layouts</em></div></article><article><span className="metric-icon aqua"><FiDownload /></span><div><small>Downloads</small><strong>0</strong><em>This month</em></div></article><article><span className="metric-icon violet"><FiArrowRight /></span><div><small>Completion</small><strong>Live</strong><em>Updates as you write</em></div></article></section><section className="dashboard-empty"><div className="empty-icon"><FiFileText /></div><h2>Your resume workspace is ready</h2><p>Choose a polished template, add your details, and download a tailored PDF.</p><Button colorScheme="teal" rightIcon={<FiArrowRight />} onClick={() => setSelectBtn(false)}>Choose a template</Button></section></> : <><header className="template-heading"><button onClick={() => setSelectBtn(true)}>← Back to dashboard</button><h1>Choose your template</h1><p>Select a professional layout that best represents your style.</p></header><section className="dashboard-templates">{ThemeTemplateData.slice(0, 4).map((item, index) => <article key={item.id} className="dashboard-template"><div className="template-preview"><img src={item.imageSrc} alt={`${templateNames[index]} resume template`} /></div><h2>{templateNames[index]}</h2><p>{['Clean and modern design', 'Traditional and polished', 'Creative and colourful', 'Minimal and simple design'][index]}</p><Button variant="outline" colorScheme="teal" size="sm" onClick={() => chooseTemplate(item.id)}>Use this template</Button></article>)}</section></>}
  </main></div>;
}
