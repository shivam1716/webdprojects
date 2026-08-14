import React from 'react';
import { FiAward, FiBarChart2, FiClock, FiGrid, FiTarget } from 'react-icons/fi';

const points = '8,90 48,72 88,55 128,79 168,53 208,34 248,62 288,77 328,25 368,66 408,58 448,26';
const Dashboard = () => <main className="dashboard">
  <section className="dashboard-title"><span><FiBarChart2 /> Statistics</span><p>Track your progress and improve your skills</p></section>
  <section className="summary-cards">
    <div><small>Total Games</small><strong>12</strong><FiGrid /></div><div><small>Games Won</small><strong>8</strong><FiAward /></div><div><small>Win Rate</small><strong>66.7%</strong><FiTarget /></div><div><small>Best Time</small><strong>01:45</strong><FiClock /></div>
  </section>
  <section className="chart-card line-chart"><h3>Win Rate Over Time</h3><div className="chart-scale"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><svg viewBox="0 0 460 130" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#d25bff" stopOpacity=".4"/><stop offset="1" stopColor="#d25bff" stopOpacity="0"/></linearGradient></defs><polygon points={`${points} 448,130 8,130`} fill="url(#fill)"/><polyline points={points} fill="none" stroke="#dc77ff" strokeWidth="2"/>{points.split(' ').map((p) => { const [x,y] = p.split(','); return <circle key={p} cx={x} cy={y} r="3" fill="#e693ff"/>; })}</svg></section>
  <section className="chart-card difficulty-chart"><h3>Games by Difficulty</h3>{[['Easy', '8', '100%'], ['Medium', '3', '42%'], ['Hard', '1', '18%'], ['Expert', '0', '0%']].map(([name, value, width]) => <div className="bar-row" key={name}><span>{name}</span><i><b style={{width}} /></i><em>{value}</em></div>)}</section>
  <section className="chart-card donut-card"><h3>Win Rate by Difficulty</h3><div className="donut" /><div className="legend"><span><i /> Easy (75%)</span><span><i /> Medium (66.7%)</span><span><i /> Hard (50%)</span><span><i /> Expert (0%)</span></div></section>
</main>;
export default Dashboard;
