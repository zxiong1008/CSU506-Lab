export interface SearchResult {
  found: boolean
  index: number
  comparisons: number
  timeMs: number
}

/**
 * Linear Search - O(n) time complexity
 * Works on unsorted arrays by checking each element sequentially
 */
export function linearSearch(array: number[], target: number): SearchResult {
  const startTime = performance.now()
  let comparisons = 0

  for (let i = 0; i < array.length; i++) {
    comparisons++
    if (array[i] === target) {
      const timeMs = performance.now() - startTime
      return { found: true, index: i, comparisons, timeMs }
    }
  }

  const timeMs = performance.now() - startTime
  return { found: false, index: -1, comparisons, timeMs }
}

/**
 * Binary Search - O(log n) time complexity
 * Only works on sorted arrays
 */
export function binarySearch(array: number[], target: number): SearchResult {
  const startTime = performance.now()
  let comparisons = 0
  let left = 0
  let right = array.length - 1

  while (left <= right) {
    comparisons++
    const mid = Math.floor((left + right) / 2)
    const midValue = array[mid]

    if (midValue === target) {
      const timeMs = performance.now() - startTime
      return { found: true, index: mid, comparisons, timeMs }
    } else if (midValue < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  const timeMs = performance.now() - startTime
  return { found: false, index: -1, comparisons, timeMs }
}

/**
 * Static unsorted data for 100 elements
 */
const STATIC_UNSORTED_100 = [
  342, 891, 156, 723, 489, 234, 567, 901, 445, 612, 378, 834, 521, 678, 289, 756, 403, 920, 614, 371,
  845, 192, 689, 523, 876, 412, 735, 628, 501, 764, 289, 456, 801, 534, 671, 345, 912, 456, 789, 123,
  654, 987, 321, 234, 567, 876, 543, 210, 876, 432, 987, 654, 321, 876, 109, 765, 432, 876, 543, 210,
  567, 234, 876, 543, 210, 987, 654, 321, 876, 432, 765, 432, 876, 543, 210, 567, 234, 876, 543, 210,
  987, 654, 321, 876, 432, 765, 432, 876, 543, 210, 567, 234, 876, 543, 210, 987, 654, 321, 876, 432,
]

/**
 * Static sorted data for 100 elements
 */
const STATIC_SORTED_100 = [
  12, 34, 56, 78, 90, 112, 134, 156, 178, 190, 212, 234, 256, 278, 290, 312, 334, 356, 378, 390,
  412, 434, 456, 478, 490, 512, 534, 556, 578, 590, 612, 634, 656, 678, 690, 712, 734, 756, 778, 790,
  812, 834, 856, 878, 890, 912, 934, 956, 978, 990, 1012, 1034, 1056, 1078, 1090, 1112, 1134, 1156, 1178, 1190,
  1212, 1234, 1256, 1278, 1290, 1312, 1334, 1356, 1378, 1390, 1412, 1434, 1456, 1478, 1490, 1512, 1534, 1556, 1578, 1590,
  1612, 1634, 1656, 1678, 1690, 1712, 1734, 1756, 1778, 1790, 1812, 1834, 1856, 1878, 1890, 1912, 1934, 1956, 1978, 1990,
]

/**
 * Generate static unsorted array by repeating the base pattern
 */
export function generateUnsortedArray(size: number): number[] {
  if (size <= 100) {
    return STATIC_UNSORTED_100.slice(0, size)
  }
  
  // For larger sizes, repeat and offset the pattern
  const result: number[] = []
  const baseSize = STATIC_UNSORTED_100.length
  let offset = 0
  
  while (result.length < size) {
    for (let i = 0; i < baseSize && result.length < size; i++) {
      result.push(STATIC_UNSORTED_100[i] + offset * 100)
    }
    offset++
  }
  
  return result
}

/**
 * Generate static sorted array by repeating the base pattern
 */
export function generateSortedArray(size: number): number[] {
  if (size <= 100) {
    return STATIC_SORTED_100.slice(0, size)
  }
  
  // For larger sizes, repeat and offset the pattern while maintaining sort order
  const result: number[] = []
  const baseSize = STATIC_SORTED_100.length
  let offset = 0
  
  while (result.length < size) {
    for (let i = 0; i < baseSize && result.length < size; i++) {
      result.push(STATIC_SORTED_100[i] + offset * 2000)
    }
    offset++
  }
  
  return result
}

/**
 * Run performance tests on different array sizes
 */
export interface BenchmarkResult {
  arraySize: number
  linearSearchTime: number
  linearSearchComparisons: number
  binarySearchTime: number
  binarySearchComparisons: number
  targetValue: number
}

export function runBenchmarks(): BenchmarkResult[] {
  const sizes = [100, 1000, 10000]
  const results: BenchmarkResult[] = []

  for (const size of sizes) {
    const sortedArray = generateSortedArray(size)
    // Target a value that would be near the end to show worst case for linear
    const targetValue = sortedArray[Math.floor(size * 0.8)]

    const linearResult = linearSearch(sortedArray, targetValue)
    const binaryResult = binarySearch(sortedArray, targetValue)

    results.push({
      arraySize: size,
      linearSearchTime: linearResult.timeMs,
      linearSearchComparisons: linearResult.comparisons,
      binarySearchTime: binaryResult.timeMs,
      binarySearchComparisons: binaryResult.comparisons,
      targetValue,
    })
  }

  return results
}
