import { useState } from 'react'
import './Project4Tool.css'
import { runLinearStructureBenchmarksAPI, type LinearStructureBenchmarks } from './apiClient'

type Structure = 'Stack' | 'Queue' | 'Deque' | 'Linked list'
type Example = 'delimiters' | 'roundRobin' | 'palindrome' | 'duplicates'

class ListStack {
  items: string[] = []
  push(value: string) { this.items.push(value) }
  pop() { return this.items.pop() }
  peek() { return this.items[this.items.length - 1] }
  isEmpty() { return this.items.length === 0 }
}

class ListQueue {
  items: string[] = []
  enqueue(value: string) { this.items.push(value) }
  dequeue() { return this.items.shift() }
  front() { return this.items[0] }
  isEmpty() { return this.items.length === 0 }
}

class ListDeque {
  items: string[] = []
  addFront(value: string) { this.items.unshift(value) }
  addRear(value: string) { this.items.push(value) }
  removeFront() { return this.items.shift() }
  removeRear() { return this.items.pop() }
  isEmpty() { return this.items.length === 0 }
}

class SimpleLinkedList {
  items: string[] = []
  insert(value: string) { this.items.unshift(value) }
  delete(value: string) { const index = this.items.indexOf(value); if (index < 0) return false; this.items.splice(index, 1); return true }
  search(value: string) { return this.items.includes(value) }
  display() { return [...this.items] }
  isEmpty() { return this.items.length === 0 }
}

const descriptions: Record<Structure, string> = {
  Stack: 'Last in, first out: the newest item leaves first.',
  Queue: 'First in, first out: the oldest item gets served first.',
  Deque: 'Both ends are active, so items can enter or leave from either side.',
  'Linked list': 'Nodes form a chain; insertion at the head is constant time.',
}

const complexity: Record<Structure, Record<string, string>> = {
  Stack: { push: 'O(1)', pop: 'O(1)', peek: 'O(1)', isEmpty: 'O(1)' },
  Queue: { enqueue: 'O(1)', dequeue: 'O(n)', front: 'O(1)', isEmpty: 'O(1)' },
  Deque: { addFront: 'O(n)', addRear: 'O(1)', removeFront: 'O(n)', removeRear: 'O(1)', isEmpty: 'O(1)' },
  'Linked list': { insert: 'O(1)', delete: 'O(n)', search: 'O(n)', display: 'O(n)', isEmpty: 'O(1)' },
}

const operations: Record<Structure, string[]> = {
  Stack: ['push', 'pop', 'peek', 'isEmpty'],
  Queue: ['enqueue', 'dequeue', 'front', 'isEmpty'],
  Deque: ['addFront', 'addRear', 'removeFront', 'removeRear', 'isEmpty'],
  'Linked list': ['insert', 'delete', 'search', 'display', 'isEmpty'],
}

const examples: { id: Example; title: string; structure: Structure; prompt: string }[] = [
  { id: 'delimiters', title: 'Balanced delimiters', structure: 'Stack', prompt: 'Check whether {[()]} is correctly nested.' },
  { id: 'roundRobin', title: 'Round-robin scheduler', structure: 'Queue', prompt: 'Cycle A, B, and C through four time slices.' },
  { id: 'palindrome', title: 'Palindrome checker', structure: 'Deque', prompt: 'Compare both ends of “level”.' },
  { id: 'duplicates', title: 'Remove duplicates', structure: 'Linked list', prompt: 'Preserve first-seen order in 3, 1, 3, 2, 1.' },
]

function runExample(example: Example) {
  if (example === 'delimiters') {
    const stack = new ListStack()
    for (const value of '{[()]}') {
      if (value.match(/[([{]/)) stack.push(value)
      else stack.pop()
    }
    return `Balanced: ${stack.isEmpty() ? 'yes' : 'no'}`
  }
  if (example === 'roundRobin') {
    const queue = new ListQueue()
    ;['A', 'B', 'C'].forEach((value) => queue.enqueue(value))
    const result: string[] = []
    for (let index = 0; index < 4; index += 1) {
      const value = queue.dequeue()!
      result.push(value)
      queue.enqueue(value)
    }
    return `Order: ${result.join(' → ')}`
  }
  if (example === 'palindrome') {
    const deque = new ListDeque()
    'level'.split('').forEach((value) => deque.addRear(value))
    let matches = true
    while (deque.items.length > 1) matches = matches && deque.removeFront() === deque.removeRear()
    return `Palindrome: ${matches ? 'yes' : 'no'}`
  }
  const linkedList = new SimpleLinkedList()
  ;[3, 1, 3, 2, 1].forEach((value) => { if (!linkedList.search(String(value))) linkedList.insert(String(value)) })
  return `Unique values: ${linkedList.display().reverse().join(', ')}`
}

function Project4Tool({ onBack }: { onBack: () => void }) {
  const [structure, setStructure] = useState<Structure>('Stack')
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('Ready for an operation.')
  const [activeExample, setActiveExample] = useState<Example>('delimiters')
  const [exampleResult, setExampleResult] = useState('')
  const [benchmarkResults, setBenchmarkResults] = useState<LinearStructureBenchmarks | null>(null)
  const [benchmarkLoading, setBenchmarkLoading] = useState(false)

  function changeStructure(next: Structure) {
    setStructure(next)
    setItems([])
    setMessage('Structure reset. Add a value to begin.')
  }

  function addItem() {
    if (!input.trim()) return
    const value = input.trim()
    const next = [...items]
    if (structure === 'Stack' || structure === 'Linked list') next.unshift(value)
    else next.push(value)
    setItems(next)
    setInput('')
    setMessage(`${structure} accepted “${value}”.`)
  }

  function removeItem() {
    if (!items.length) { setMessage(`${structure} is empty.`); return }
    const next = [...items]
    const removed = structure === 'Stack' || structure === 'Queue' ? next.shift() : next.pop()
    setItems(next)
    setMessage(`${structure} removed “${removed}”.`)
  }

  function peekItem() {
    const stack = new ListStack()
    stack.items = [...items]
    setMessage(stack.isEmpty() ? 'Stack.peek() → The stack is empty.' : `Stack.peek() → “${stack.peek()}” (not removed)`)
  }

  function checkEmpty() {
    const candidate = structure === 'Stack' ? new ListStack() : structure === 'Queue' ? new ListQueue() : structure === 'Deque' ? new ListDeque() : new SimpleLinkedList()
    candidate.items = [...items]
    setMessage(`${structure}.isEmpty() → ${candidate.isEmpty() ? 'True: the structure is empty.' : 'False: the structure contains items.'}`)
  }

  async function runBenchmark() {
    setBenchmarkLoading(true)
    setMessage('Measuring representative operations for all four structures...')
    try {
      const results = await runLinearStructureBenchmarksAPI()
      setBenchmarkResults(results)
      setMessage('Performance comparison complete for Stack, Queue, Deque, and Linked list.')
    } catch {
      setMessage('Performance test could not connect to the API. Start the backend on http://localhost:8000.')
    } finally {
      setBenchmarkLoading(false)
    }
  }

  return (
    <div className="project4-tool-page">
      <header className="project4-topbar"><button className="back-link" type="button" onClick={onBack}>← Requirements</button><span>CSU 506 <b>•</b> PROJECT 04</span></header>
      <main className="project4-content">
        <div className="project4-heading"><div><p className="project4-kicker">INTERACTIVE TEST PROGRAM / LINEAR STRUCTURES</p><h1>Choose the right<br /><em>shape</em><span>.</span></h1><p>Run the operations, inspect the behavior, and connect each structure to a real problem.</p></div><div className="project4-count"><strong>04</strong><span>structures<br />to compare</span></div></div>
        <section className="project4-tabs" role="tablist" aria-label="Choose data structure">{(['Stack', 'Queue', 'Deque', 'Linked list'] as Structure[]).map((item) => <button key={item} type="button" className={structure === item ? 'active' : ''} onClick={() => changeStructure(item)}>{item}<small>{item === 'Stack' ? 'LIFO' : item === 'Queue' ? 'FIFO' : item === 'Deque' ? 'TWO ENDS' : 'NODES'}</small></button>)}</section>
        <section className="project4-main-grid">
          <div className="project4-playground">
            <div className="project4-panel-header"><div><span>LIVE PLAYGROUND</span><h2>{structure}</h2></div><b>{complexity[structure][operations[structure][0]]} {operations[structure][0]}</b></div>
            <p className="project4-description">{descriptions[structure]}</p>
            <div className={`project4-items ${structure.toLowerCase().replace(' ', '-')}`}>{items.length ? items.map((item, index) => <div key={`${item}-${index}`} className="project4-item"><span>{item}</span>{structure === 'Linked list' && <i>→</i>}</div>) : <span className="project4-empty">Your structure is empty</span>}</div>
            <div className="project4-controls"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addItem()} placeholder="Enter a value" aria-label="Enter a value" /><button type="button" onClick={addItem}>Insert <span>＋</span></button>{structure === 'Stack' && <button type="button" className="secondary" onClick={peekItem}>Peek</button>}<button type="button" className="secondary" onClick={removeItem}>Remove</button><button type="button" className="secondary" onClick={checkEmpty}>Check empty</button></div>
            <p className="project4-message"><i />{message}</p>
          </div>
          <aside className="project4-complexity"><span>PERFORMANCE SNAPSHOT</span><h2>Operation efficiency</h2>{operations[structure].map((operation) => <div className="complexity-row" key={operation}><span>{operation}()</span><strong>{complexity[structure][operation]}</strong></div>)}<p>Complexity shows the expected cost of each operation for the selected implementation.</p><button type="button" className="benchmark-button" onClick={runBenchmark} disabled={benchmarkLoading}>{benchmarkLoading ? 'Measuring...' : benchmarkResults ? 'Run again' : 'Run performance test'} <span>→</span></button></aside>
        </section>
        {benchmarkResults && <section className="project4-benchmark-results"><div className="project4-section-heading"><span>MEASURED PERFORMANCE</span><strong>ALL OPERATIONS / ALL IMPLEMENTATIONS</strong></div><div className="benchmark-table" role="table" aria-label="Data structure operation performance comparison"><div className="benchmark-row benchmark-header" role="row"><span>Structure</span><span>Operation</span><span>Complexity</span><span>Time</span></div>{(['Stack', 'Queue', 'Deque', 'Linked list'] as Structure[]).flatMap((name) => Object.entries(benchmarkResults[name].operations).map(([operation, result]) => <div className="benchmark-row" role="row" key={`${name}-${operation}`}><strong>{name}</strong><span>{operation}()</span><span>{result.complexity}</span><span>{result.timeMs.toFixed(3)} ms</span></div>))}</div></section>}
        <section className="project4-examples"><div className="project4-section-heading"><span>PROBLEM-SOLVING EXAMPLES</span><strong>USE THE STRUCTURE</strong></div><div className="example-grid">{examples.map((example) => <button type="button" key={example.id} className={activeExample === example.id ? 'example-card active' : 'example-card'} onClick={() => setActiveExample(example.id)}><span>{example.structure}</span><h3>{example.title}</h3><p>{example.prompt}</p><b>→</b></button>)}</div><div className="example-result">{exampleResult || 'Select an example to run its algorithm.'}<button type="button" onClick={() => setExampleResult(runExample(activeExample))}>Run example</button></div></section>
      </main>
    </div>
  )
}

export default Project4Tool
