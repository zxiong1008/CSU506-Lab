import { useState, useEffect } from 'react'
import './DataStructureTool.css'
import { linearSearchAPI, binarySearchAPI, getArrayElementsAPI, runBenchmarksAPI, type SearchResult, type BenchmarkResult } from './apiClient'

type SearchAlgorithm = 'Linear Search' | 'Binary Search'

function SearchAlgorithmTool({ onBack }: { onBack: () => void }) {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('Linear Search')
  const [arraySize, setArraySize] = useState(100)
  const [searchValue, setSearchValue] = useState('')
  const [array, setArray] = useState<number[]>([])
  const [result, setResult] = useState<SearchResult | null>(null)
  const [benchmarks, setBenchmarks] = useState<BenchmarkResult[]>([])
  const [showBenchmarks, setShowBenchmarks] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown')

  // Initialize array on mount or when size/algorithm changes
  useEffect(() => {
    const loadArray = async () => {
      setError(null)
      setIsLoading(true)
      try {
        const arrayType = algorithm === 'Linear Search' ? 'unsorted' : 'sorted'
        const elements = await getArrayElementsAPI(arraySize, arrayType)
        setArray(elements)
        setApiStatus('connected')
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load array'
        setError(errorMsg)
        setApiStatus('disconnected')
        console.error('Array load error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadArray()
    setResult(null)
  }, [arraySize, algorithm])

  const handleSearch = async () => {
    const target = parseInt(searchValue, 10)
    if (isNaN(target)) {
      alert('Please enter a valid number')
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      let searchResult: SearchResult
      if (algorithm === 'Linear Search') {
        searchResult = await linearSearchAPI(target, arraySize)
      } else {
        searchResult = await binarySearchAPI(target, arraySize)
      }
      setResult(searchResult)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed'
      setError(errorMsg)
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunBenchmarks = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const results = await runBenchmarksAPI()
      setBenchmarks(results)
      setShowBenchmarks(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Benchmarks failed'
      setError(errorMsg)
      console.error('Benchmarks error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="requirements-page">
      <header className="requirements-topbar">
        <button className="back-link" type="button" onClick={onBack}>
          ← Requirements
        </button>
        <span className="tool-course">
          CSU 506 <b>•</b> PROJECT 02
        </span>
      </header>
      <main className="requirements-content">
        <section className="requirements-hero">
          <div>
            <p className="eyebrow">INTERACTIVE TOOL</p>
            <h1>
              Search Algorithm
              <br />
              <em>Comparison Tool</em>
              <span>.</span>
            </h1>
            <p>Compare the performance of linear and binary search algorithms in real-time.</p>
            {apiStatus === 'disconnected' && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '6px',
                color: '#856404',
                fontSize: '14px'
              }}>
                ⚠️ API is disconnected. Ensure Docker containers are running: <code>docker-compose up</code>
              </div>
            )}
            {apiStatus === 'connected' && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#d4edda',
                border: '1px solid #28a745',
                borderRadius: '6px',
                color: '#155724',
                fontSize: '14px'
              }}>
                ✓ Connected to API (http://localhost:8000/api/project2)
              </div>
            )}
          </div>
        </section>

        <section className="requirements-grid">
          <div className="brief-panel">
            <div className="panel-heading">
              <span>CONTROLS</span>
              <strong>01</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Select Algorithm:
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {(['Linear Search', 'Binary Search'] as const).map((algo) => (
                    <button
                      key={algo}
                      type="button"
                      onClick={() => setAlgorithm(algo)}
                      style={{
                        padding: '8px 16px',
                        border: '2px solid',
                        borderColor: algorithm === algo ? '#ff6b35' : '#ddd',
                        background: algorithm === algo ? '#fff5f0' : '#f9f9f9',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        fontWeight: algorithm === algo ? 600 : 400,
                      }}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Array Size: {arraySize.toLocaleString()} elements
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={arraySize}
                  onChange={(e) => setArraySize(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
                <small style={{ color: '#666' }}>
                  {isLoading ? (
                    'Loading array from API...'
                  ) : (
                    <>
                      {algorithm === 'Linear Search'
                        ? 'Unsorted array (via API)'
                        : 'Sorted array (via API)'}
                      {apiStatus === 'connected' && <span style={{ marginLeft: '8px', color: '#28a745' }}>✓ API</span>}
                      {apiStatus === 'disconnected' && <span style={{ marginLeft: '8px', color: '#dc3545' }}>✗ API</span>}
                    </>
                  )}
                </small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Search Value:
                </label>
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter a number to search..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                {error && (
                  <div style={{
                    padding: '12px',
                    background: '#ffebee',
                    color: '#c62828',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isLoading}
                  style={{
                    padding: '12px 16px',
                    background: isLoading ? '#cccccc' : '#ff6b35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {isLoading ? 'Searching...' : 'Perform Search'}
                </button>
              </div>
            </div>
          </div>

          <div className="requirements-list">
            <div className="panel-heading">
              <span>RESULTS</span>
              <strong>{result ? '1 item' : '0 items'}</strong>
            </div>
            {result ? (
              <div
                style={{
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #eee',
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ fontSize: '16px' }}>
                    {result.found ? '✓ Found' : '✗ Not Found'}
                  </strong>
                </div>
                {result.found && (
                  <p>
                    <strong>Index:</strong> {result.index}
                  </p>
                )}
                <p>
                  <strong>Comparisons:</strong> {result.comparisons}
                </p>
                <p>
                  <strong>Time:</strong> {result.timeMs.toFixed(4)} ms
                </p>
              </div>
            ) : (
              <p style={{ color: '#999' }}>No search performed yet. Enter a value and click search.</p>
            )}
          </div>
        </section>

        <section className="deliverables-panel">
          <div className="panel-heading">
            <span>ALGORITHM INFO</span>
            <strong>02 algorithms</strong>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div style={{ padding: '16px', background: '#f0f7ff', borderRadius: '6px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#0066cc' }}>Linear Search</h3>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Time Complexity:</strong> O(n)
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Space Complexity:</strong> O(1)
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Works on:</strong> Unsorted or sorted arrays
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Best for:</strong> Small arrays or unsorted data
              </p>
            </div>
            <div style={{ padding: '16px', background: '#f0fff0', borderRadius: '6px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#00aa00' }}>Binary Search</h3>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Time Complexity:</strong> O(log n)
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Space Complexity:</strong> O(1)
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Works on:</strong> Sorted arrays only
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Best for:</strong> Large sorted datasets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunBenchmarks}
            disabled={isLoading}
            style={{
              padding: '12px 16px',
              background: isLoading ? '#999999' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            {isLoading ? 'Running...' : 'Run Performance Benchmarks'}
          </button>

          {showBenchmarks && benchmarks.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '12px' }}>Benchmark Results</h3>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Array Size</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Linear (Time)</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Linear (Comparisons)</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Binary (Time)</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Binary (Comparisons)</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((benchmark) => (
                    <tr key={benchmark.arraySize} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{benchmark.arraySize.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>{benchmark.linearSearchTime.toFixed(4)} ms</td>
                      <td style={{ padding: '12px' }}>{benchmark.linearSearchComparisons}</td>
                      <td style={{ padding: '12px' }}>{benchmark.binarySearchTime.toFixed(4)} ms</td>
                      <td style={{ padding: '12px' }}>{benchmark.binarySearchComparisons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAnalysis(!showAnalysis)}
            style={{
              padding: '12px 16px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              marginTop: '16px',
              marginRight: '8px',
            }}
          >
            {showAnalysis ? 'Hide' : 'Show'} Big O Analysis
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: '12px 16px',
              background: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              marginTop: '16px',
            }}
          >
            {showPreview ? 'Hide' : 'Show'} Array Preview
          </button>

          {showAnalysis && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#fff9e6', borderRadius: '6px' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Big O Notation Analysis</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <p>
                  <strong>Linear Search - O(n)</strong>
                </p>
                <ul style={{ marginTop: '8px' }}>
                  <li>Checks each element sequentially until found or end reached</li>
                  <li>Worst case: must check all n elements</li>
                  <li>Average case: checks n/2 elements</li>
                  <li>Does not require sorted data</li>
                </ul>

                <p style={{ marginTop: '16px' }}>
                  <strong>Binary Search - O(log n)</strong>
                </p>
                <ul style={{ marginTop: '8px' }}>
                  <li>Eliminates half of remaining elements with each comparison</li>
                  <li>Worst case: log₂(n) comparisons for n elements</li>
                  <li>Example: 1,000,000 elements = maximum 20 comparisons</li>
                  <li>Requires sorted data beforehand</li>
                </ul>

                <p style={{ marginTop: '16px' }}>
                  <strong>Performance Comparison:</strong>
                </p>
                <ul style={{ marginTop: '8px' }}>
                  <li>100 elements: Linear ~50, Binary ~7</li>
                  <li>1,000 elements: Linear ~500, Binary ~10</li>
                  <li>10,000 elements: Linear ~5,000, Binary ~14</li>
                  <li>Binary search becomes dramatically faster as data grows</li>
                </ul>
              </div>
            </div>
          )}

          {showPreview && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f5f5f5', borderRadius: '6px' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Array Elements Table</h3>
              <small style={{ display: 'block', marginBottom: '12px', color: '#666' }}>
                Total elements: {array.length.toLocaleString()}
                {result?.found && <span style={{ marginLeft: '16px' }}>• Found at index {result.index}</span>}
              </small>
              
              <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                >
                  <thead style={{ position: 'sticky', top: 0 }}>
                    <tr style={{ background: '#ddd', borderBottom: '2px solid #999' }}>
                      <th style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #bbb', minWidth: '50px' }}>
                        Index
                      </th>
                      <th style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #bbb', minWidth: '70px' }}>
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {array.map((element, index) => (
                      <tr
                        key={index}
                        style={{
                          background:
                            result?.found && result.index === index
                              ? '#fff3cd'
                              : index % 2 === 0
                                ? '#fafafa'
                                : '#ffffff',
                          borderBottom: '1px solid #eee',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <td
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            borderRight: '1px solid #eee',
                            color: result?.found && result.index === index ? '#ff6b35' : '#666',
                            fontWeight: result?.found && result.index === index ? 600 : 400,
                          }}
                        >
                          {index}
                        </td>
                        <td
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            background:
                              result?.found && result.index === index
                                ? '#ffe5cc'
                                : undefined,
                            color: result?.found && result.index === index ? '#cc4400' : '#333',
                            fontWeight: result?.found && result.index === index ? 700 : 500,
                          }}
                        >
                          {element}
                          {result?.found && result.index === index && ' ← FOUND'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <small style={{ display: 'block', marginTop: '12px', color: '#666' }}>
                {result?.found ? (
                  <span style={{ color: '#00aa00' }}>✓ Highlighted row shows found element</span>
                ) : result ? (
                  <span style={{ color: '#cc0000' }}>✗ Element not found in array</span>
                ) : (
                  <span>Perform a search to highlight the found element</span>
                )}
              </small>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default SearchAlgorithmTool
