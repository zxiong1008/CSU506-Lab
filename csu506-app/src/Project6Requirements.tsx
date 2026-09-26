import './Project1Requirements.css'

type Project6RequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Binary search tree', 'Implement insert, search, delete, in-order, pre-order, and post-order operations while preserving ordering.'],
  ['02', 'Tree-backed Map', 'Store string keys with heterogeneous values and support update, lookup, contains, delete, and sorted iteration.'],
  ['03', 'Tree manipulation', 'Find minimum and maximum values, report height, and detect whether every subtree is height-balanced.'],
  ['04', '50-item demonstration', 'Exercise numeric BST keys and a Map containing values of several JSON types.'],
  ['05', 'Performance and visualization', 'Compare tree-map lookup with list-map lookup, and visualize the tree as operations change it.'],
]

const deliverables = [
  'Binary search tree source with insert, delete, search, extrema, and traversal methods',
  'Tree-backed Map source with key-value operations',
  'Traversal output examples and 50-item mixed-value demonstration',
  'Tree-vs-list lookup benchmark with timing and complexity notes',
  'Written evaluation of tree data structures and their best use cases',
  'Interactive tree visualization before and after insertions and deletions',
]

function Project6Requirements({ onBack, onOpenTool }: Project6RequirementsProps) {
  return (
    <div className="requirements-page">
      <header className="requirements-topbar">
        <button className="back-link" type="button" onClick={onBack}>← Dashboard</button>
        <span className="tool-course">CSU 506 <b>•</b> PROJECT 06</span>
      </header>
      <main className="requirements-content">
        <div className="requirements-kicker"><span>PROJECT 06</span><span className="requirement-status">In Progress</span></div>
        <section className="requirements-hero">
          <div>
            <p className="eyebrow">PROJECT REQUIREMENTS</p>
            <h1>Binary Search Tree<br /><em>&amp; Tree Map</em><span>.</span></h1>
            <p>Explore ordered lookup, traversal, deletion, balance detection, and a Map built from a binary search tree.</p>
          </div>
          <button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button>
        </section>

        <section className="requirements-grid">
          <div className="brief-panel">
            <div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div>
            <h2>What this project should do</h2>
            <p>Build an ordered tree from comparable keys, make its structure and traversal order visible, and use the same BST to implement a sorted key-value map.</p>
            <div className="connection-note"><span>↗</span><div><strong>Industry connection</strong><p>Search trees support ordered indexes, range queries, symbol tables, and in-memory maps when maintaining sorted keys matters alongside lookup.</p></div></div>
          </div>
          <div className="requirements-list">
            <div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>
            {requirements.map(([number, title, description]) => <div className="requirement-row" key={number}><span className="requirement-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}
          </div>
        </section>

        <section className="deliverables-panel">
          <div className="panel-heading"><span>DELIVERABLES</span><strong>06 items</strong></div>
          <div className="deliverables-grid">{deliverables.map((item, index) => <div className="deliverable" key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div>
        </section>

        <section className="analysis-panel">
          <div className="panel-heading"><span>ANALYSIS NOTES</span><strong>WHEN TREES HELP</strong></div>
          <div className="analysis-grid">
            <article><h3>Ordered lookups</h3><p>A balanced search tree supports lookup, insertion, deletion, and predecessor/successor queries in O(log n), while in-order traversal returns sorted keys.</p></article>
            <article><h3>Balance matters</h3><p>A plain BST can become a chain after ordered insertions, degrading operations to O(n). Self-balancing trees such as AVL and red-black trees bound height.</p></article>
            <article><h3>Trade-offs</h3><p>Trees use extra links and may have more overhead than arrays or hash maps. A hash map is usually preferable when order and range operations are unnecessary.</p></article>
            <article><h3>Benchmark carefully</h3><p>Measured time depends on data shape, workload, runtime, and hardware. Complexity and comparison counts explain scaling more reliably than a single timing run.</p></article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Project6Requirements
