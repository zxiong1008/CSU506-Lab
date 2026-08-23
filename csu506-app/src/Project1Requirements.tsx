import './Project1Requirements.css'

type ProjectRequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Three core structures', 'Implement and demonstrate a stack, queue, and linked list.'],
  ['02', 'Interactive interface', 'Show how each structure works through clear, hands-on operations.'],
  ['03', 'Complexity analyzer', 'Predict time and space complexity for insert, delete, and search.'],
  ['04', 'Visual demonstrations', 'Explain when each structure is useful and what makes it a good choice.'],
  ['05', 'Performance testing', 'Compare predicted complexity with actual operation times.'],
]

const deliverables = ['Working implementations with documentation', 'Interface demonstrating each operation', 'Big-O complexity prediction tool', 'Performance report with accuracy charts', 'One-page analysis and selection criteria', 'Three-to-five-minute demonstration video']

function Project1Requirements({ onBack, onOpenTool }: ProjectRequirementsProps) {
  return <div className="requirements-page">
    <header className="requirements-topbar"><button className="back-link" type="button" onClick={onBack}>← Dashboard</button><span className="tool-course">CSU 506 <b>•</b> PROJECT 01</span></header>
    <main className="requirements-content">
      <div className="requirements-kicker"><span>PROJECT 01</span><span className="requirement-status complete"><i /> Completed</span></div>
      <section className="requirements-hero"><div><p className="eyebrow">PROJECT REQUIREMENTS</p><h1>Data Structure<br /><em>Learning Tool</em><span>.</span></h1><p>Build an interactive learning experience that makes data structure trade-offs visible, testable, and easier to understand.</p></div><button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button></section>
      <section className="requirements-grid"><div className="brief-panel"><div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div><h2>What this project should do</h2><p>Demonstrate the importance of different data structures and help users predict algorithm complexity for common operations.</p><div className="connection-note"><span>↗</span><div><strong>Industry connection</strong><p>Data structure trade-offs and complexity analysis are essential skills for software engineering interviews and system design decisions.</p></div></div></div><div className="requirements-list"><div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>{requirements.map(([number, title, description]) => <div className="requirement-row" key={number}><span className="requirement-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
      <section className="deliverables-panel"><div className="panel-heading"><span>DELIVERABLES</span><strong>06 items</strong></div><div className="deliverables-grid">{deliverables.map((deliverable, index) => <div className="deliverable" key={deliverable}><span>{String(index + 1).padStart(2, '0')}</span>{deliverable}</div>)}</div></section>
    </main>
  </div>
}

export default Project1Requirements
