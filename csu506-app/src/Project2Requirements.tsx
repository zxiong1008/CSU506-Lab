import './Project1Requirements.css'

type ProjectRequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Linear search function', 'Implement linear search that works on unsorted arrays with O(n) complexity.'],
  ['02', 'Binary search function', 'Implement binary search that works on sorted arrays with O(log n) complexity.'],
  ['03', 'Timing system', 'Build a timing system that measures execution time for each search algorithm.'],
  ['04', 'Performance testing', 'Test both algorithms on arrays of 100, 1000, and 10000 elements.'],
  ['05', 'Interactive interface', 'Create a UI where users can input search values and see results.'],
]

const deliverables = [
  'Linear search implementation (O(n))',
  'Binary search implementation (O(log n))',
  'Performance testing results for different array sizes',
  'Written analysis explaining Big O notation',
  'Screenshots showing the tool with different datasets',
  'Recommendation guide for algorithm selection',
]

function Project2Requirements({ onBack, onOpenTool }: ProjectRequirementsProps) {
  return (
    <div className="requirements-page">
      <header className="requirements-topbar">
        <button className="back-link" type="button" onClick={onBack}>
          ← Dashboard
        </button>
        <span className="tool-course">
          CSU 506 <b>•</b> PROJECT 02
        </span>
      </header>
      <main className="requirements-content">
        <div className="requirements-kicker">
          <span>PROJECT 02</span>
          <span className="requirement-status">In Progress</span>
        </div>
        <section className="requirements-hero">
          <div>
            <p className="eyebrow">PROJECT REQUIREMENTS</p>
            <h1>
              Algorithm Comparison
              <br />
              <em>Search Tool</em>
              <span>.</span>
            </h1>
            <p>
              Build an interactive tool that demonstrates the performance differences between linear and binary search algorithms on arrays
              of varying sizes.
            </p>
          </div>
          <button className="open-tool-button" type="button" onClick={onOpenTool}>
            Open working tool <span>→</span>
          </button>
        </section>
        <section className="requirements-grid">
          <div className="brief-panel">
            <div className="panel-heading">
              <span>THE BRIEF</span>
              <strong>01</strong>
            </div>
            <h2>What this project should do</h2>
            <p>
              Demonstrate the real-world performance impact of algorithm selection by comparing linear and binary search across different
              array sizes, showing why Big O notation matters.
            </p>
            <div className="connection-note">
              <span>↗</span>
              <div>
                <strong>Industry connection</strong>
                <p>
                  Algorithm selection based on complexity analysis is a core skill for software engineers. Understanding when to use which
                  algorithm can impact system performance dramatically.
                </p>
              </div>
            </div>
          </div>
          <div className="requirements-list">
            <div className="panel-heading">
              <span>REQUIREMENTS</span>
              <strong>05 items</strong>
            </div>
            {requirements.map(([number, title, description]) => (
              <div className="requirement-row" key={number}>
                <span className="requirement-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="deliverables-panel">
          <div className="panel-heading">
            <span>DELIVERABLES</span>
            <strong>06 items</strong>
          </div>
          <div className="deliverables-grid">
            {deliverables.map((deliverable, index) => (
              <div className="deliverable" key={deliverable}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {deliverable}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Project2Requirements
