import './Project1Requirements.css'

type Project4RequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Four linear structures', 'Implement Stack, Queue, Deque, and LinkedList with the required operations.'],
  ['02', 'Use-case algorithms', 'Solve delimiter matching, round-robin scheduling, palindrome checking, and duplicate removal.'],
  ['03', 'Interactive test program', 'Run each structure with sample data and inspect the operation result.'],
  ['04', 'Performance comparison', 'Measure representative operations and contrast their time complexity.'],
  ['05', 'Written analysis', 'Explain the strengths, weaknesses, and appropriate selection criteria for all four structures.'],
]

const deliverables = [
  'Stack, Queue, Deque, and LinkedList source files',
  'Test suite covering every required operation',
  'Four problem-solving demonstrations',
  'Interactive operation playground',
  'Performance comparison with Big-O notes',
  'Two-page structure selection analysis',
]

function Project4Requirements({ onBack, onOpenTool }: Project4RequirementsProps) {
  return <div className="requirements-page">
    <header className="requirements-topbar"><button className="back-link" type="button" onClick={onBack}>← Dashboard</button><span className="tool-course">CSU 506 <b>•</b> PROJECT 04</span></header>
    <main className="requirements-content">
      <div className="requirements-kicker"><span>PROJECT 04</span><span className="requirement-status complete"><i /> Completed</span></div>
      <section className="requirements-hero"><div><p className="eyebrow">PROJECT REQUIREMENTS</p><h1>Linear Data<br /><em>Structure Lab</em><span>.</span></h1><p>Build a practical suite of linear structures, then use the right one for the job instead of treating every collection the same.</p></div><button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button></section>
      <section className="requirements-grid"><div className="brief-panel"><div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div><h2>What this project should do</h2><p>Make the trade-offs between four list-based structures visible through correct implementations, realistic examples, and measured operations.</p><div className="connection-note"><span>↗</span><div><strong>Industry connection</strong><p>Stacks power undo history, queues coordinate work, deques support sliding windows, and linked lists model changing chains of records.</p></div></div></div><div className="requirements-list"><div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>{requirements.map(([number, title, description]) => <div className="requirement-row" key={number}><span className="requirement-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
      <section className="deliverables-panel"><div className="panel-heading"><span>DELIVERABLES</span><strong>06 items</strong></div><div className="deliverables-grid">{deliverables.map((deliverable, index) => <div className="deliverable" key={deliverable}><span>{String(index + 1).padStart(2, '0')}</span>{deliverable}</div>)}</div></section>
      <section className="analysis-panel"><div className="panel-heading"><span>ANALYSIS NOTES</span><strong>SELECTION GUIDE</strong></div><div className="analysis-grid"><article><h3>Stack</h3><p>Choose LIFO behavior when the newest item must be handled first. Push, pop, and peek are O(1), making stacks ideal for undo flows and nested syntax.</p></article><article><h3>Queue</h3><p>Choose FIFO behavior for fair processing. Enqueue is O(1), while this list-backed implementation pays O(n) for dequeue because items shift left.</p></article><article><h3>Deque</h3><p>Choose a deque when both ends matter, such as a work-stealing buffer or palindrome check. Front changes are O(n) with a Python list.</p></article><article><h3>Linked list</h3><p>Choose a linked list when nodes change frequently and a known node can be updated cheaply. Search remains O(n), and each node uses extra link memory.</p></article></div></section>
    </main>
  </div>
}

export default Project4Requirements
