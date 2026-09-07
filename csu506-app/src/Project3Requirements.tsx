import './Project1Requirements.css'

type Project3RequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Four sorting algorithms', 'Implement bubble, selection, insertion, and merge sort with correctness checks.'],
  ['02', 'Dataset generator', 'Create random, already sorted, reverse sorted, and partially sorted datasets.'],
  ['03', 'Timing system', 'Measure execution time for 1,000, 5,000, 10,000, and 50,000 elements.'],
  ['04', 'Performance report', 'Compare all algorithm and dataset combinations in a readable table and chart.'],
  ['05', 'Recommendation guide', 'Explain which algorithm fits each data characteristic and why complexity matters.'],
]

const deliverables = [
  'Documented source code for all four sorting algorithms',
  'Four deterministic dataset generators',
  'Timing results across 64 test combinations',
  'Charts showing performance differences',
  'Written analysis of algorithm trade-offs',
  'Practical algorithm selection guide',
]

function Project3Requirements({ onBack, onOpenTool }: Project3RequirementsProps) {
  return (
    <div className="requirements-page">
      <header className="requirements-topbar"><button className="back-link" type="button" onClick={onBack}>← Dashboard</button><span className="tool-course">CSU 506 <b>•</b> PROJECT 03</span></header>
      <main className="requirements-content">
        <div className="requirements-kicker"><span>PROJECT 03</span><span className="requirement-status">In Progress</span></div>
        <section className="requirements-hero"><div><p className="eyebrow">PROJECT REQUIREMENTS</p><h1>Sorting Performance<br /><em>Comparison Lab</em><span>.</span></h1><p>Build an evidence-led comparison of four classic sorting methods across data shapes and sizes, then turn the results into practical engineering advice.</p></div><button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button></section>
        <section className="requirements-grid"><div className="brief-panel"><div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div><h2>What this project should do</h2><p>Show how algorithmic complexity and input order affect real execution time. The lab tests the same four algorithms against four dataset shapes at four sizes, making the trade-offs visible instead of theoretical.</p><div className="connection-note"><span>↗</span><div><strong>Industry connection</strong><p>Sorting is a routine systems operation. Knowing when a simple adaptive method is enough, and when guaranteed O(n log n) growth is worth the overhead, is a practical performance skill.</p></div></div></div><div className="requirements-list"><div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>{requirements.map(([number, title, description]) => <div className="requirement-row" key={number}><span className="requirement-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
        <section className="deliverables-panel"><div className="panel-heading"><span>DELIVERABLES</span><strong>06 items</strong></div><div className="deliverables-grid">{deliverables.map((deliverable, index) => <div className="deliverable" key={deliverable}><span>{String(index + 1).padStart(2, '0')}</span>{deliverable}</div>)}</div></section>
        <section className="analysis-panel"><div className="panel-heading"><span>ANALYSIS NOTES</span><strong>USE THIS GUIDE</strong></div><div className="analysis-grid"><article><h3>Bubble sort</h3><p>O(n²) average and worst case, but with an early-exit check it can recognize already sorted input in O(n). Use it to teach local swaps and as a baseline, not for large production datasets.</p></article><article><h3>Selection sort</h3><p>O(n²) regardless of input order and O(1) extra space. It performs few writes, which can matter when writes are expensive, but it does not adapt to nearly sorted data.</p></article><article><h3>Insertion sort</h3><p>O(n²) average, O(n) best case, and stable in this implementation. It is a strong choice for small or nearly sorted collections and is often useful inside hybrid algorithms.</p></article><article><h3>Merge sort</h3><p>O(n log n) in every case with predictable scaling and stable ordering. It uses extra memory, but it is the dependable choice for large datasets or unknown input order.</p></article></div></section>
      </main>
    </div>
  )
}

export default Project3Requirements
