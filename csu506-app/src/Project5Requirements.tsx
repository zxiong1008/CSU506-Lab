import './Project1Requirements.css'

type Project5RequirementsProps = { onBack: () => void; onOpenTool: () => void }

const requirements = [
  ['01', 'Hash table design', 'Implement a hash table that stores key-value pairs and resolves collisions without overwriting valid entries.'],
  ['02', 'Collision handling', 'Use chaining or another collision strategy and verify that lookups still return the correct value.'],
  ['03', 'Search and delete behavior', 'Support insert, lookup, contains, and delete operations with predictable behavior.'],
  ['04', 'Priority queue logic', 'Build a binary-heap priority queue that always returns the highest-priority item at the front.'],
  ['05', 'Performance analysis', 'Compare hash-table lookup speed against linear search and explain the trade-off in complexity and memory.'],
]

const deliverables = [
  'Hash table source code with collision handling',
  'Priority queue implementation using a heap',
  'Insert/search/delete demo for each structure',
  'Performance comparison against linear search',
  'Big-O analysis of the hash-table and heap operations',
  'Written explanation of when to choose each structure',
]

function Project5Requirements({ onBack, onOpenTool }: Project5RequirementsProps) {
  return (
    <div className="requirements-page">
      <header className="requirements-topbar">
        <button className="back-link" type="button" onClick={onBack}>← Dashboard</button>
        <span className="tool-course">CSU 506 <b>•</b> PROJECT 05</span>
      </header>
      <main className="requirements-content">
        <div className="requirements-kicker"><span>PROJECT 05</span><span className="requirement-status complete"><i /> Completed</span></div>
        <section className="requirements-hero">
          <div>
            <p className="eyebrow">PROJECT REQUIREMENTS</p>
            <h1>Hash Table &amp;<br /><em>Priority Queue</em><span>.</span></h1>
            <p>Use a hash table for near-constant-time lookup and a heap-backed priority queue when the next most important task must be selected immediately.</p>
          </div>
          <button className="open-tool-button" type="button" onClick={onOpenTool}>Open working tool <span>→</span></button>
        </section>

        <section className="requirements-grid">
          <div className="brief-panel">
            <div className="panel-heading"><span>THE BRIEF</span><strong>01</strong></div>
            <h2>What this project should do</h2>
            <p>Model two classic structures that solve different problems: direct lookup via hashing and ordered extraction via priority. The result should make the performance difference visible in code and in measured timing.</p>
            <div className="connection-note">
              <span>↗</span>
              <div>
                <strong>Industry connection</strong>
                <p>Hash tables power caches, dictionaries, and symbol lookup, while priority queues support schedulers, routing, and event handling where urgency matters.</p>
              </div>
            </div>
          </div>

          <div className="requirements-list">
            <div className="panel-heading"><span>REQUIREMENTS</span><strong>05 items</strong></div>
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
          <div className="panel-heading"><span>DELIVERABLES</span><strong>06 items</strong></div>
          <div className="deliverables-grid">
            {deliverables.map((deliverable, index) => (
              <div className="deliverable" key={deliverable}><span>{String(index + 1).padStart(2, '0')}</span>{deliverable}</div>
            ))}
          </div>
        </section>

        <section className="analysis-panel">
          <div className="panel-heading"><span>ANALYSIS NOTES</span><strong>WHEN TO USE EACH</strong></div>
          <div className="analysis-grid">
            <article>
              <h3>Hash table</h3>
              <p>Use a hash table when fast lookup, insertion, and membership checks are more important than sorted order. Average cost is near O(1).</p>
            </article>
            <article>
              <h3>Priority queue</h3>
              <p>Use a priority queue when the highest-priority task must be selected repeatedly without sorting the full collection each time.</p>
            </article>
            <article>
              <h3>Collisions</h3>
              <p>Collisions are expected as the table fills up. Good collision handling preserves correctness and keeps performance close to the theoretical average.</p>
            </article>
            <article>
              <h3>Heap property</h3>
              <p>The binary heap keeps the most urgent item at the root, so access is immediate and rebalancing happens in logarithmic time after updates.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Project5Requirements
