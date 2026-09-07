/**
 * API utility for communicating with the Project 2 backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_PROJECT2_URL = `${API_BASE_URL}/api/project2`
const API_PROJECT3_URL = `${API_BASE_URL}/api/project3`

export interface SearchResult {
  found: boolean
  index: number
  comparisons: number
  timeMs: number
}

export interface BenchmarkResult {
  arraySize: number
  linearSearchTime: number
  linearSearchComparisons: number
  binarySearchTime: number
  binarySearchComparisons: number
  targetValue: number
}

export interface SortingBenchmarkResult {
  algorithm: 'bubble' | 'selection' | 'insertion' | 'merge'
  dataset: 'random' | 'sorted' | 'reverse' | 'partial'
  size: number
  timeMs: number | null
  status: 'measured' | 'limit'
}

export async function linearSearchAPI(searchValue: number, arraySize: number = 100): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${API_PROJECT2_URL}/linear-search?search_value=${searchValue}&array_size=${arraySize}`,
      { method: 'POST' }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Linear search API error:', error)
    throw error
  }
}

export async function binarySearchAPI(searchValue: number, arraySize: number = 100): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${API_PROJECT2_URL}/binary-search?search_value=${searchValue}&array_size=${arraySize}`,
      { method: 'POST' }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Binary search API error:', error)
    throw error
  }
}

export async function getArrayElementsAPI(size: number, arrayType: 'sorted' | 'unsorted' = 'unsorted'): Promise<number[]> {
  try {
    const response = await fetch(
      `${API_PROJECT2_URL}/array-elements/${size}?array_type=${arrayType}`
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.elements
  } catch (error) {
    console.error('Get array elements API error:', error)
    throw error
  }
}

export async function runBenchmarksAPI(): Promise<BenchmarkResult[]> {
  try {
    const response = await fetch(`${API_PROJECT2_URL}/benchmarks`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.benchmarks
  } catch (error) {
    console.error('Benchmarks API error:', error)
    throw error
  }
}

export async function healthCheckAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_PROJECT2_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('Health check error:', error)
    return false
  }
}

export async function runSortingBenchmarksAPI(): Promise<SortingBenchmarkResult[]> {
  const response = await fetch(`${API_PROJECT3_URL}/benchmarks`)
  if (!response.ok) throw new Error(`Sorting API Error: ${response.status}`)
  const data = await response.json()
  return data.benchmarks
}
