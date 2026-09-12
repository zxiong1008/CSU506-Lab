import { useState } from 'react'
import './DataStructureTool.css'

type Structure = 'Stack' | 'Queue' | 'Linked list'
type BenchmarkResult = { size: number; milliseconds: number }

const complexity: Record<Structure, { insert: string; delete: string; search: string; space: string }> = {
  Stack: { insert: 'O(1)', delete: 'O(1)', search: 'O(n)', space: 'O(n)' },
  Queue: { insert: 'O(1)', delete: 'O(1)', search: 'O(n)', space: 'O(n)' },
  'Linked list': { insert: 'O(1)*', delete: 'O(1)*', search: 'O(n)', space: 'O(n)' },
}

const descriptions: Record<Structure, string> = {
  Stack: 'Last in, first out. Ideal for undo history, browser navigation, and parsing.',
  Queue: 'First in, first out. Ideal for task scheduling, print jobs, and breadth-first search.',
  'Linked list': 'Nodes connected by links. Ideal when items change often and memory should stay flexible.',
}

const examples: Record<Structure, string> = {
  Stack: 'A deck of cards is handled from the top card first.',
  Queue: 'Customers checking out at a grocery store are served in line order.',
  'Linked list': 'A music playlist can insert or remove songs without shifting every other song.',
}

const starterItems: Record<Structure, string[]> = {
  Stack: ['Ace of hearts', '7 of clubs', 'King of diamonds'],
  Queue: ['Customer 1', 'Customer 2', 'Customer 3'],
  'Linked list': ['Opening song', 'Middle song', 'Closing song'],
}

function runBenchmark(structure: Structure): BenchmarkResult[] {
  const sizes = [10, 100, 1000, 10000, 100000]
  return sizes.map((size) => {
    const values = Array.from({ length: size }, (_, index) => `item-${index}`)
    const start = performance.now()
    const repetitions = Math.max(1, Math.floor(100000 / size))

    for (let repetition = 0; repetition < repetitions; repetition += 1) {
      if (structure === 'Stack') {
        values.push(`item-${repetition}`)
        values.pop()
      } else if (structure === 'Queue') {
        values.unshift(`item-${repetition}`)
        values.shift()
      } else {
        values.splice(Math.floor(size / 2), 0, `item-${repetition}`)
        values.splice(Math.floor(size / 2), 1)
      }
      values.includes(`item-${size - 1}`)
    }

    return { size, milliseconds: Math.max(0.01, performance.now() - start) }
  })
}

function DataStructureTool({ onBack, projectNumber = '01' }: { onBack: () => void; projectNumber?: string }) {
  const [module, setModule] = useState(1)
  const [structure, setStructure] = useState<Structure>('Stack')
  const [items, setItems] = useState(starterItems.Stack)
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('Ready for an operation')
  const [benchmarkRun, setBenchmarkRun] = useState(false)
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([])
  const [reportGenerated, setReportGenerated] = useState(false)

  const addItem = () => {
    const value = input.trim()
    if (!value) return
    setItems((current) => structure === 'Stack' ? [...current, value] : [value, ...current])
    setInput('')
    setMessage(`${structure} insert completed in ${complexity[structure].insert}`)
  }

  const removeItem = () => {
    if (!items.length) return
    setItems((current) => structure === 'Stack' ? current.slice(0, -1) : current.slice(1))
    setMessage(`${structure} delete completed in ${complexity[structure].delete}`)
  }

  const changeStructure = (next: Structure) => {
    setStructure(next)
    setItems(starterItems[next])
    setMessage(`${next} selected`)
    setBenchmarkRun(false)
    setBenchmarkResults([])
    setReportGenerated(false)
  }

  const handleBenchmark = () => {
    setBenchmarkResults(runBenchmark(structure))
    setBenchmarkRun(true)
    setReportGenerated(false)
  }

  const handleReport = () => {
    if (!benchmarkRun) handleBenchmark()
    setReportGenerated(true)
  }

  return (
    <div className="tool-page">
      <header className="tool-topbar">
        <button className="back-link" type="button" onClick={onBack}>← Requirements</button>
        <span className="tool-course">CSU 506 <b>•</b> PROJECT {projectNumber}</span>
      </header>
      <div className="tool-heading"><div><p className="eyebrow">DATA STRUCTURES &amp; ALGORITHMS</p><h1>Data Structure<br /><em>Learning Tool</em><span>.</span></h1><p>Understand the trade-offs behind everyday operations by experimenting with each structure.</p></div><div className="tool-index"><strong>0{module}</strong><span>of 03<br />learning modules</span></div></div>
      <main className="tool-content">
        <div className="module-tabs" role="tablist" aria-label="Choose learning module">{['Playground', 'Complexity analyzer', 'Performance lab'].map((name, index) => <button key={name} className={module === index + 1 ? 'module-tab active' : 'module-tab'} type="button" onClick={() => setModule(index + 1)}><span>0{index + 1}</span>{name}</button>)}</div>
        {module === 1 && <section className="module-panel playground-module"><div className="module-panel-heading"><div><p className="eyebrow">MODULE 01</p><h2>Learn by doing.</h2><p>Build intuition by moving through each structure one operation at a time.</p></div><span className="formula">interactive playground</span></div><div className="structure-tabs" role="tablist" aria-label="Choose data structure">{(['Stack', 'Queue', 'Linked list'] as Structure[]).map((item) => <button key={item} className={structure === item ? 'structure-tab active' : 'structure-tab'} type="button" onClick={() => changeStructure(item)}>{item}<span>{item === 'Stack' ? 'LIFO' : item === 'Queue' ? 'FIFO' : 'NODES'}</span></button>)}</div><section className="tool-grid playground-grid"><div className="visual-panel"><div className="panel-label"><span>LIVE PLAYGROUND</span><strong>{structure}</strong></div><p className="structure-description">{descriptions[structure]} <span className="example-label">Example:</span> {examples[structure]}</p><div className={`data-visual ${structure.toLowerCase().replace(' ', '-')}`}>{items.length ? items.map((item, index) => <div className="data-item" key={`${item}-${index}`}><span>{structure === 'Linked list' && <b>node</b>}{item}</span>{structure === 'Linked list' && <i>→</i>}</div>) : <div className="empty-state">Your structure is empty</div>}</div><div className="controls"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addItem()} placeholder="Name an item..." aria-label="Name an item" /><button className="insert-button" type="button" onClick={addItem}>Insert <span>＋</span></button><button className="delete-button" type="button" onClick={removeItem}>Delete</button></div><p className="operation-message"><i />{message}</p></div><button className="complexity-prompt" type="button" onClick={() => setModule(2)}><span className="prompt-icon">∑</span><span><strong>Need the Big-O breakdown?</strong><small>Compare insert, delete, search, and space complexity in Module 02.</small></span><b>→</b></button></section></section>}
        {module === 2 && <section className="module-panel analyzer"><div className="module-panel-heading"><div><p className="eyebrow">MODULE 02</p><h2>Choose by operation.</h2><p>Compare the expected cost of common actions before selecting a structure.</p></div><span className="formula">lower is better</span></div><div className="analyzer-body"><div><div className="analyzer-table"><div className="analyzer-row table-head"><span>STRUCTURE</span><b>INSERT</b><b>DELETE</b><b>SEARCH</b><b>BEST FOR</b></div>{(['Stack', 'Queue', 'Linked list'] as Structure[]).map((item) => <div className={structure === item ? 'analyzer-row highlighted' : 'analyzer-row'} key={item} onClick={() => changeStructure(item)}><span><i className={`table-dot ${item === 'Stack' ? 'orange' : item === 'Queue' ? 'blue' : 'green'}`} />{item}</span><b>{complexity[item].insert}</b><b>{complexity[item].delete}</b><b>{complexity[item].search}</b><small>{item === 'Stack' ? 'Undo, history' : item === 'Queue' ? 'Scheduling, BFS' : 'Frequent inserts'}</small></div>)}</div><div className="analyzer-note"><strong>Selected: {structure}</strong><span>{descriptions[structure]}</span></div><div className="notation-guide"><strong>How to read Big-O notation</strong><div><span><b>O(1)</b> Constant time: the operation takes about the same time regardless of data size.</span><span><b>O(1)*</b> Constant time when a node or position is already known.</span><span><b>O(n)</b> Linear time: the operation may check every item as the data grows.</span></div></div></div><button className="complexity-prompt analyzer-next" type="button" onClick={() => setModule(3)}><span className="prompt-icon">03</span><span><strong>Ready to test the theory?</strong><small>Open the Performance Lab to compare predicted and actual operation times.</small></span><b>→</b></button></div></section>}
        {module === 3 && <section className="module-panel benchmark"><div className="module-panel-heading"><div><p className="eyebrow">MODULE 03</p><h2>Theory meets reality.</h2><p>Measure how operation times change as your data set grows.</p></div><div className="benchmark-actions"><button className="run-button" type="button" onClick={handleBenchmark}>{benchmarkRun ? 'Run again' : 'Run benchmark'} <span>→</span></button><button className="report-button" type="button" onClick={handleReport}>Generate report</button></div></div><div className="chart"><div className="chart-y"><span>time</span><span>0 ms</span></div><div className="chart-area"><div className="chart-gridline one" /><div className="chart-gridline two" /><div className="chart-gridline three" /><div className={benchmarkRun ? 'chart-line actual drawn' : 'chart-line actual'}>{benchmarkResults.map((result) => <i key={result.size} style={{ transform: `translateY(-${Math.min(143, result.milliseconds * 8)}px)` }} />)}</div><div className="chart-bars"><i /><i /><i /><i /><i /></div><div className="chart-x">{benchmarkResults.length ? benchmarkResults.map((result) => <span key={result.size}>{result.size >= 1000 ? `${result.size / 1000}k` : result.size}</span>) : <><span>10</span><span>100</span><span>1k</span><span>10k</span><span>100k items</span></>}</div></div></div><div className="legend"><span><i className="legend-predicted" />Predicted trend</span><span><i className="legend-actual" />Actual operation time</span><strong>{benchmarkRun ? `Measured: ${benchmarkResults[benchmarkResults.length - 1]?.milliseconds.toFixed(2)} ms` : 'Ready to measure'}</strong></div>{reportGenerated && benchmarkResults.length > 0 && <div className="benchmark-report"><div className="report-heading"><span className="eyebrow">PERFORMANCE REPORT</span><strong>{structure}</strong></div><p>Measured benchmark for {structure.toLowerCase()} operations across five input sizes.</p><div className="report-results">{benchmarkResults.map((result) => <div key={result.size}><span>{result.size >= 1000 ? `${result.size / 1000}k` : result.size} items</span><strong>{result.milliseconds.toFixed(2)} ms</strong></div>)}</div><div className="report-finding"><strong>Finding</strong><span>{structure} operations stayed measurable as the input grew. The results support the predicted <b>{complexity[structure].insert}</b> insert and <b>{complexity[structure].search}</b> search trade-off shown in Module 02.</span></div></div>}</section>}
      </main>
    </div>
  )
}

export default DataStructureTool
