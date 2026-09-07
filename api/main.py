from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
from typing import List, Dict, Any, Callable

app = FastAPI(
    title="CSU 506 Algorithms API",
    description="Search and sorting algorithm comparison API",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static data arrays
STATIC_UNSORTED_100 = [
    342, 891, 156, 723, 489, 234, 567, 901, 445, 612, 378, 834, 521, 678, 289, 756, 403, 920, 614, 371,
    845, 192, 689, 523, 876, 412, 735, 628, 501, 764, 289, 456, 801, 534, 671, 345, 912, 456, 789, 123,
    654, 987, 321, 234, 567, 876, 543, 210, 876, 432, 987, 654, 321, 876, 109, 765, 432, 876, 543, 210,
    567, 234, 876, 543, 210, 987, 654, 321, 876, 432, 765, 432, 876, 543, 210, 567, 234, 876, 543, 210,
    987, 654, 321, 876, 432, 765, 432, 876, 543, 210, 567, 234, 876, 543, 210, 987, 654, 321, 876, 432,
]

STATIC_SORTED_100 = sorted(STATIC_UNSORTED_100)


def generate_unsorted_array(size: int) -> List[int]:
    """Generate static unsorted array by repeating the base pattern."""
    if size <= 100:
        return STATIC_UNSORTED_100[:size]
    
    result = []
    base_size = len(STATIC_UNSORTED_100)
    offset = 0
    
    while len(result) < size:
        for i in range(base_size):
            if len(result) < size:
                result.append(STATIC_UNSORTED_100[i] + offset * 100)
        offset += 1
    
    return result


def generate_sorted_array(size: int) -> List[int]:
    """Generate static sorted array by repeating the base pattern."""
    if size <= 100:
        return STATIC_SORTED_100[:size]
    
    result = []
    base_size = len(STATIC_SORTED_100)
    offset = 0
    
    while len(result) < size:
        for i in range(base_size):
            if len(result) < size:
                result.append(STATIC_SORTED_100[i] + offset * 2000)
        offset += 1
    
    return result


def linear_search(array: List[int], target: int) -> Dict[str, Any]:
    """Linear search - O(n) complexity."""
    start_time = time.perf_counter()
    comparisons = 0
    
    for i, value in enumerate(array):
        comparisons += 1
        if value == target:
            elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
            return {
                "found": True,
                "index": i,
                "comparisons": comparisons,
                "timeMs": elapsed
            }
    
    elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
    return {
        "found": False,
        "index": -1,
        "comparisons": comparisons,
        "timeMs": elapsed
    }


def binary_search(array: List[int], target: int) -> Dict[str, Any]:
    """Binary search - O(log n) complexity."""
    start_time = time.perf_counter()
    comparisons = 0
    left = 0
    right = len(array) - 1
    
    while left <= right:
        comparisons += 1
        mid = (left + right) // 2
        mid_value = array[mid]
        
        if mid_value == target:
            elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
            return {
                "found": True,
                "index": mid,
                "comparisons": comparisons,
                "timeMs": elapsed
            }
        elif mid_value < target:
            left = mid + 1
        else:
            right = mid - 1
    
    elapsed = (time.perf_counter() - start_time) * 1000  # Convert to ms
    return {
        "found": False,
        "index": -1,
        "comparisons": comparisons,
        "timeMs": elapsed
    }


# Project 3 sorting algorithms and deterministic dataset generators
SORTING_SIZES = [1000, 5000, 10000, 50000]
SORTING_DATASET_TYPES = ["random", "sorted", "reverse", "partial"]
SORTING_ALGORITHMS = ["bubble", "selection", "insertion", "merge"]
QUADRATIC_LIMIT_SIZE = 10000


def bubble_sort(values: List[float]) -> List[float]:
    result = values[:]
    for end in range(len(result) - 1, 0, -1):
        swapped = False
        for index in range(end):
            if result[index] > result[index + 1]:
                result[index], result[index + 1] = result[index + 1], result[index]
                swapped = True
        if not swapped:
            break
    return result


def selection_sort(values: List[float]) -> List[float]:
    result = values[:]
    for start in range(len(result) - 1):
        minimum = start
        for index in range(start + 1, len(result)):
            if result[index] < result[minimum]:
                minimum = index
        if minimum != start:
            result[start], result[minimum] = result[minimum], result[start]
    return result


def insertion_sort(values: List[float]) -> List[float]:
    result = values[:]
    for index in range(1, len(result)):
        current = result[index]
        position = index - 1
        while position >= 0 and result[position] > current:
            result[position + 1] = result[position]
            position -= 1
        result[position + 1] = current
    return result


def merge_sort(values: List[float]) -> List[float]:
    if len(values) < 2:
        return values[:]
    midpoint = len(values) // 2
    left = merge_sort(values[:midpoint])
    right = merge_sort(values[midpoint:])
    merged: List[float] = []
    left_index = right_index = 0
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            merged.append(left[left_index])
            left_index += 1
        else:
            merged.append(right[right_index])
            right_index += 1
    return merged + left[left_index:] + right[right_index:]


SORT_FUNCTIONS: Dict[str, Callable[[List[float]], List[float]]] = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort,
}


def generate_sorting_dataset(size: int, dataset_type: str) -> List[float]:
    values = [((index * 7919 + 104729) % (size * 10)) + index / size for index in range(size)]
    if dataset_type == "random":
        for index in range(size - 1, 0, -1):
            swap_index = (index * 31 + 17) % (index + 1)
            values[index], values[swap_index] = values[swap_index], values[index]
        return values
    ordered = sorted(values)
    if dataset_type == "sorted":
        return ordered
    if dataset_type == "reverse":
        return list(reversed(ordered))
    cutoff = int(size * 0.8)
    for index in range(cutoff, size):
        swap_index = (index * 13 + 7) % size
        ordered[index], ordered[swap_index] = ordered[swap_index], ordered[index]
    return ordered


def validate_sorting_inputs(size: int, dataset_type: str, algorithm: str | None = None) -> None:
    if size < 1 or size > 50000:
        raise HTTPException(status_code=400, detail="Size must be between 1 and 50000")
    if dataset_type not in SORTING_DATASET_TYPES:
        raise HTTPException(status_code=400, detail=f"Dataset type must be one of: {', '.join(SORTING_DATASET_TYPES)}")
    if algorithm is not None and algorithm not in SORTING_ALGORITHMS:
        raise HTTPException(status_code=400, detail=f"Algorithm must be one of: {', '.join(SORTING_ALGORITHMS)}")


def benchmark_sort(algorithm: str, dataset_type: str, size: int) -> Dict[str, Any]:
    if size >= QUADRATIC_LIMIT_SIZE and algorithm != "merge":
        return {
            "algorithm": algorithm,
            "dataset": dataset_type,
            "size": size,
            "timeMs": None,
            "status": "limit",
        }
    values = generate_sorting_dataset(size, dataset_type)
    started = time.perf_counter()
    sorted_values = SORT_FUNCTIONS[algorithm](values)
    elapsed = (time.perf_counter() - started) * 1000
    if sorted_values != sorted(values):
        raise RuntimeError(f"{algorithm} sort returned an invalid result")
    return {
        "algorithm": algorithm,
        "dataset": dataset_type,
        "size": size,
        "timeMs": elapsed,
        "status": "measured",
    }


# API Routes with /api/project2 and /api/project3 prefixes


@app.get("/api/project3/health")
async def sorting_health_check():
    """Health check endpoint for the Project 3 sorting service."""
    return {"status": "healthy", "service": "CSU 506 Project 3 Sorting API"}


@app.get("/api/project3/dataset/{size}")
async def get_sorting_dataset(size: int, dataset_type: str = "random"):
    """Generate one deterministic sorting dataset."""
    validate_sorting_inputs(size, dataset_type)
    return {
        "size": size,
        "dataset": dataset_type,
        "elements": generate_sorting_dataset(size, dataset_type),
    }


@app.post("/api/project3/sort")
async def sort_dataset(algorithm: str, size: int = 1000, dataset_type: str = "random"):
    """Sort one generated dataset and return its timing and sorted values."""
    validate_sorting_inputs(size, dataset_type, algorithm)
    if size >= QUADRATIC_LIMIT_SIZE and algorithm != "merge":
        return benchmark_sort(algorithm, dataset_type, size)
    values = generate_sorting_dataset(size, dataset_type)
    started = time.perf_counter()
    sorted_values = SORT_FUNCTIONS[algorithm](values)
    elapsed = (time.perf_counter() - started) * 1000
    return {
        "algorithm": algorithm,
        "dataset": dataset_type,
        "size": size,
        "timeMs": elapsed,
        "status": "measured",
        "sorted": sorted_values,
    }


@app.get("/api/project3/benchmarks")
async def run_sorting_benchmarks():
    """Run the complete 64-case Project 3 benchmark matrix."""
    results = [
        benchmark_sort(algorithm, dataset_type, size)
        for algorithm in SORTING_ALGORITHMS
        for dataset_type in SORTING_DATASET_TYPES
        for size in SORTING_SIZES
    ]
    return {
        "algorithms": SORTING_ALGORITHMS,
        "datasets": SORTING_DATASET_TYPES,
        "sizes": SORTING_SIZES,
        "benchmarks": results,
    }

@app.get("/api/project2/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "CSU 506 Project 2 API"}


@app.get("/api/project2/array-elements/{size}")
async def get_array_elements(size: int, array_type: str = "unsorted"):
    """
    Get array elements.
    
    Args:
        size: Number of elements (100-10000)
        array_type: 'unsorted' or 'sorted'
    
    Returns:
        Array of integers
    """
    if size < 1 or size > 10000:
        raise HTTPException(status_code=400, detail="Size must be between 1 and 10000")
    
    if array_type == "sorted":
        array = generate_sorted_array(size)
    else:
        array = generate_unsorted_array(size)
    
    return {
        "size": size,
        "type": array_type,
        "elements": array
    }


@app.post("/api/project2/linear-search")
async def perform_linear_search(search_value: int, array_size: int = 100):
    """
    Perform linear search on unsorted array.
    
    Args:
        search_value: Value to search for
        array_size: Size of array to generate
    
    Returns:
        Search result with found status, index, comparisons, and time
    """
    if array_size < 1 or array_size > 10000:
        raise HTTPException(status_code=400, detail="Array size must be between 1 and 10000")
    
    array = generate_unsorted_array(array_size)
    result = linear_search(array, search_value)
    
    return {
        "algorithm": "linear-search",
        "arraySize": array_size,
        "searchValue": search_value,
        "result": result
    }


@app.post("/api/project2/binary-search")
async def perform_binary_search(search_value: int, array_size: int = 100):
    """
    Perform binary search on sorted array.
    
    Args:
        search_value: Value to search for
        array_size: Size of array to generate
    
    Returns:
        Search result with found status, index, comparisons, and time
    """
    if array_size < 1 or array_size > 10000:
        raise HTTPException(status_code=400, detail="Array size must be between 1 and 10000")
    
    array = generate_sorted_array(array_size)
    result = binary_search(array, search_value)
    
    return {
        "algorithm": "binary-search",
        "arraySize": array_size,
        "searchValue": search_value,
        "result": result
    }


@app.get("/api/project2/benchmarks")
async def run_benchmarks():
    """
    Run performance benchmarks on different array sizes.
    
    Returns:
        Benchmark results comparing linear and binary search
    """
    sizes = [100, 1000, 10000]
    results = []
    
    for size in sizes:
        sorted_array = generate_sorted_array(size)
        # Target a value near the end to show worst case for linear
        target_value = sorted_array[int(size * 0.8)]
        
        linear_result = linear_search(sorted_array, target_value)
        binary_result = binary_search(sorted_array, target_value)
        
        results.append({
            "arraySize": size,
            "linearSearchTime": linear_result["timeMs"],
            "linearSearchComparisons": linear_result["comparisons"],
            "binarySearchTime": binary_result["timeMs"],
            "binarySearchComparisons": binary_result["comparisons"],
            "targetValue": target_value
        })
    
    return {
        "benchmarks": results
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
