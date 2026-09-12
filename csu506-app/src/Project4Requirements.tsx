import './Project1Requirements.css'

type ProjectRequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Four implementations', 'Build Stack, Queue, Deque, and LinkedList classes with the required operations.'],
  ['02', 'Use-case algorithms', 'Demonstrate delimiter matching, round-robin scheduling, palindrome checking, and duplicate removal.'],
  ['03', 'Executable tests', 'Verify normal operations, empty-state behavior, and each problem-solving example.'],
  ['04', 'Performance comparison', 'Compare operation efficiency using Big O notation and representative timings.'],
  ['05', 'Written analysis', 'Explain the strengths, weaknesses, and appropriate use of each structure.'],
]

const deliverables = [
  'Stack, Queue, Deque, and LinkedList source code',
  'Problem-solving examples for each structure',
  'Executable test program with sample data',
  'Performance benchmark function and complexity table',
  'Two-page comparison and use-case analysis',
]

function Project4Requirements({ onBack, onOpenTool }: ProjectRequirementsProps) {
  return <div className="requirements-page">
    <header className="requirements-topbar"><button className="back-link" type="button" onClick={onBack}>← Dashboard</button><span className="tool-course">CSU 506 <b>•</b> PROJECT 04</span></header>
    <main className="requirements-content">
      <div className="requirements-kicker"><span>PROJECT 04</span><span className="requirement-status">In Progress</span></div>
      <section className="requirements-hero"><div><p className="eyebrow">PROJECT REQUIREMENTS</p><h1>Linear Data<br /><em>Structures Suite</em><span>.</span></h1><p>Implement, test, and compare four linear data structures through practical algorithms and measurable performance trade-offs.</p></div><button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button></section>
      <section className="requirements-grid"><div className="brief-panel"><div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div><h2>What this project should do</h2><p>Show how the right ordering rule and storage model make common algorithms clearer and more efficient.</p><div className="connection-note"><span>↗</span><div><strong>Industry connection</strong><p>Stacks, queues, deques, and linked lists appear in scheduling, parsing, navigation, buffering, and systems design.</p></div></div></div><div className="requirements-list"><div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>{requirements.map(([number, title, description]) => <div className="requirement-row" key={number}><span className="requirement-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
      <section className="deliverables-panel"><div className="panel-heading"><span>DELIVERABLES</span><strong>05 items</strong></div><div className="deliverables-grid">{deliverables.map((deliverable, index) => <div className="deliverable" key={deliverable}><span>{String(index + 1).padStart(2, '0')}</span>{deliverable}</div>)}</div></section>
    </main>
  </div>
}

export default Project4Requirements