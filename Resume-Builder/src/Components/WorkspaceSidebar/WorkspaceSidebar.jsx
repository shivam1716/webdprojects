import React, { useContext } from 'react';
import { FiGrid, FiUser, FiBriefcase, FiBookOpen, FiAward, FiFolder, FiLayout, FiEye, FiLogOut } from 'react-icons/fi';
import ResumeContext from '../../Context/ResumeContext';
import './workspaceSidebar.css';

const links = [
  ['Dashboard', FiGrid, 'dashboard'], ['Personal info', FiUser, 'personal-info'],
  ['Experience', FiBriefcase, 'experience'], ['Education', FiBookOpen, 'education'],
  ['Skills', FiAward, 'skills'], ['Projects', FiFolder, 'projects'], ['Templates', FiLayout, 'templates'], ['Preview & download', FiEye, 'preview'],
];

export default function WorkspaceSidebar({ active = 'Dashboard' }) {
  const { setShowComponent, setSelectBtn, setRequestedSection } = useContext(ResumeContext);
  const navigate = (target) => {
    if (target === 'dashboard') { setRequestedSection(null); setShowComponent(false); setSelectBtn(true); return; }
    if (target === 'templates') { setShowComponent(false); setSelectBtn(false); return; }
    const section = document.getElementById(target);
    if (section) { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    setRequestedSection(target);
    setShowComponent(true);
  };
  return <aside className="workspace-sidebar">
    <div className="workspace-brand"><span>R</span><strong>Resume Builder</strong></div>
    <nav>{links.map(([label, Icon, target]) => <button key={target} onClick={() => navigate(target)} className={active === label ? 'active' : ''}><Icon />{label}</button>)}</nav>
    <button className="exit-button" onClick={() => navigate('dashboard')}><FiLogOut /> Exit workspace</button>
  </aside>;
}
