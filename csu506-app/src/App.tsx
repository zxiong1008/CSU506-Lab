import { useState } from 'react'
import './App.css'
import DataStructureTool from './DataStructureTool'
import Project1Requirements from './Project1Requirements'
import Project2Requirements from './Project2Requirements'
import Project3Requirements from './Project3Requirements'
import Project4Requirements from './Project4Requirements'
import SearchAlgorithmTool from './SearchAlgorithmTool'
import SortingAlgorithmTool from './SortingAlgorithmTool'

type Project = { number: string; title: string; course: string; status: 'Completed' | 'In Progress' | 'Placeholder'; description: string; progress: number }

const projects: Project[] = [
  { number: '01', title: 'Data Structure Learning Tool', course: 'CSU 506 • Project 01', status: 'Completed', description: 'Explore stacks, queues, and linked lists through interactive operations and complexity analysis.', progress: 100 },
  { number: '02', title: 'Algorithm Comparison Tool', course: 'CSU 506 • Project 02', status: 'In Progress', description: 'Compare linear and binary search algorithms with real-time performance analysis.', progress: 80 },
  { number: '03', title: 'Sorting Performance Lab', course: 'CSU 506 • Project 03', status: 'In Progress', description: 'Measure bubble, selection, insertion, and merge sort across four dataset shapes.', progress: 100 },
  { number: '04', title: 'Linear Data Structures Suite', course: 'CSU 506 • Project 04', status: 'In Progress', description: 'Implement and compare stacks, queues, deques, and linked lists through practical algorithms.', progress: 80 },
  ...Array.from({ length: 4 }, (_, index) => ({ number: String(index + 5).padStart(2, '0'), title: 'Project placeholder', course: `CSU 506 • Project ${String(index + 5).padStart(2, '0')}`, status: 'Placeholder' as const, description: 'Requirements and solution notes will live here when this project is ready.', progress: 0 })),
]

function App() {
  const [view, setView] = useState<'dashboard' | 'requirements' | 'tool'>('dashboard')
  const [activeProject, setActiveProject] = useState('01')
  const [query, setQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Overview')
  const filteredProjects = projects.filter((project) => `${project.title} ${project.description}`.toLowerCase().includes(query.toLowerCase()))
  const selectedProject = projects.find((project) => project.number === activeProject) ?? projects[0]

  if (view === 'requirements') {
    if (activeProject === '01') return <Project1Requirements onBack={() => setView('dashboard')} onOpenTool={() => setView('tool')} />
    if (activeProject === '02') return <Project2Requirements onBack={() => setView('dashboard')} onOpenTool={() => setView('tool')} />
    if (activeProject === '03') return <Project3Requirements onBack={() => setView('dashboard')} onOpenTool={() => setView('tool')} />
    if (activeProject === '04') return <Project4Requirements onBack={() => setView('dashboard')} onOpenTool={() => setView('tool')} />
  }
  if (view === 'tool') {
    if (activeProject === '01') return <DataStructureTool onBack={() => setView('requirements')} />
    if (activeProject === '02') return <SearchAlgorithmTool onBack={() => setView('requirements')} />
    if (activeProject === '03') return <SortingAlgorithmTool onBack={() => setView('requirements')} />
    if (activeProject === '04') return <DataStructureTool onBack={() => setView('requirements')} projectNumber="04" />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        
        <div className="brand"><span className="brand-mark">C</span><span>CSU <b>GLOBAL</b></span></div>
        <div className="course-label">COURSE HUB</div><div className="course-name">CSU 506</div><div className="course-subtitle">Design and Analysis of Algorithms</div>
        <nav aria-label="Main navigation">{['Overview', 'All projects', 'Notes'].map((item) => <button key={item} className={activeNav === item ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(item)} type="button"><span className="nav-icon">{item === 'Overview' ? '◈' : item === 'All projects' ? '▦' : '≡'}</span>{item}</button>)}</nav>
        <div className="sidebar-footer"><span className="avatar">AS</span><span><strong>Alex Student</strong><small>Spring 2025</small></span><span className="more">•••</span></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumb">MY COURSEWORK <span>/</span> <strong>{activeNav.toUpperCase()}</strong></div><button className="icon-button" type="button" aria-label="Notifications">♧<i /></button></header>
        <section className="page-intro"><div><p className="eyebrow">SPRING 2025 <span>•</span> 8 PROJECTS</p><h1>Good morning, Zeng<span className="orange-dot">.</span></h1><p className="intro-copy">Your central workspace for building, testing, and documenting each project.</p></div><button className="primary-action" type="button" onClick={() => setActiveProject('01')}><span>＋</span> New project</button></section>
        <section className="stat-row" aria-label="Course progress"><div className="stat-card accent"><span className="stat-icon">↗</span><div><small>OVERALL PROGRESS</small><strong>100<span>%</span></strong></div><div className="mini-bar"><i style={{ width: '100%' }} /></div></div><div className="stat-card"><span className="stat-icon blue">◷</span><div><small>ACTIVE PROJECTS</small><strong>00<span> / 08</span></strong></div><p>Project 01 is complete</p></div><div className="stat-card"><span className="stat-icon green">✓</span><div><small>COMPLETED</small><strong>01</strong></div><p>One project completed</p></div></section>
        <div className="workspace-heading"><div><h2>Project workspace</h2><p>Track requirements, solutions, and progress in one place.</p></div><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" aria-label="Search projects" /></label></div>
        <section className="project-layout"><div className="project-grid">{filteredProjects.map((project) => <button type="button" key={project.number} className={activeProject === project.number ? 'project-card selected' : 'project-card'} onClick={() => setActiveProject(project.number)}><div className="project-top"><span className="project-number">{project.number}</span><span className={project.status === 'Completed' ? 'status complete' : project.status === 'In Progress' ? 'status in-progress' : 'status'}>{project.status === 'Completed' && <i />}{project.status}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-bottom"><span>{project.course}</span><span className="arrow">↗</span></div></button>)}</div><aside className="detail-panel"><div className="detail-header"><span className="detail-kicker">SELECTED PROJECT</span><span className={selectedProject.status === 'Completed' ? 'status complete' : selectedProject.status === 'In Progress' ? 'status in-progress' : 'status'}><i />{selectedProject.status}</span></div><h2>{selectedProject.title}</h2><p className="detail-course">{selectedProject.course}</p><div className="detail-progress"><div><span>Project progress</span><strong>{selectedProject.progress}%</strong></div><div className="progress-track"><i style={{ width: `${selectedProject.progress}%` }} /></div></div><div className="detail-section"><span className="section-label">DELIVERABLES</span><ul>{activeProject === '01' && <><li><span className="check done">✓</span> Working data structures <small>complete</small></li><li><span className="check done">✓</span> Complexity prediction tool</li><li><span className="check done">✓</span> Performance comparison report</li><li><span className="check done">✓</span> Analysis &amp; demo video</li></> || <><li><span className="check">⟳</span> Linear search implementation</li><li><span className="check">⟳</span> Binary search implementation</li><li><span className="check">⟳</span> Performance benchmarks</li><li><span className="check">⟳</span> Big O analysis document</li></>}</ul></div><button className="view-button" type="button" onClick={() => setView('requirements')}>View project <span>→</span></button></aside></section>
        <footer className="page-footer"><span>CSU GLOBAL <b>•</b> CSU 506</span><span>Last synced just now</span></footer>
      </main>
    </div>
  )
}

export default App
