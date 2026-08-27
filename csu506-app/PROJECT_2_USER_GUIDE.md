# Project 2: Quick Start Guide

## How to Access Project 2

1. **From the Dashboard:**
   - Open the application (http://localhost:5173/)
   - Look for "Project 02: Algorithm Comparison Tool" in the project grid
   - Click on the project card to select it

2. **View Requirements:**
   - Click "View requirements" button in the detail panel
   - Review the 5 requirements and 6 deliverables

3. **Open the Tool:**
   - From the requirements page, click "Open working tool"
   - Or from the dashboard, select Project 02 and click "View requirements" then "Open working tool"

## Using the Tool

### Step 1: Select an Algorithm
- **Linear Search** - For small or unsorted data
- **Binary Search** - For large sorted data

### Step 2: Set Array Size
- Use the slider to choose: 100, 1000, or 10,000 elements
- Array is automatically generated based on algorithm type
  - Linear Search: Unsorted array
  - Binary Search: Sorted array

### Step 3: Search for a Value
- Enter a number in the "Search Value" input field
- Press Enter or click "Perform Search"
- Results display instantly with:
  - Found/Not Found status
  - Index position (if found)
  - Number of comparisons made
  - Execution time in milliseconds

### Step 4: Compare Performance
- Try the same search with both algorithms
- Notice how Binary Search uses fewer comparisons
- Observe the time difference (more noticeable on larger arrays)

### Step 5: Run Benchmarks
- Click "Run Performance Benchmarks"
- View a detailed table comparing both algorithms
- See results for 100, 1000, and 10,000 element arrays

### Step 6: Learn Big O Notation
- Click "Show Big O Analysis"
- Read explanations for O(n) and O(log n) complexity
- See practical comparison numbers

### Step 7: Preview Array Data
- Click "Show Array Preview"
- See the first 20 elements of the current array
- Useful for understanding what data you're searching

## Example Workflow

1. Start with Linear Search on 100 elements
   - Search for a value
   - Note the comparisons and time

2. Switch to Binary Search with same array
   - Search for same value
   - Compare the comparisons count

3. Increase array size to 10,000
   - Search with Linear Search - more comparisons
   - Search with Binary Search - minimal comparisons
   - Performance difference becomes very clear

4. Run benchmarks
   - See quantified performance data
   - Understand why Big O matters

## Key Insights

### When Array Size = 100:
- Linear Search: ~50 comparisons (average)
- Binary Search: ~7 comparisons (maximum)
- Difference: Not dramatic, but visible

### When Array Size = 10,000:
- Linear Search: ~5,000 comparisons (average)
- Binary Search: ~14 comparisons (maximum)
- Difference: Massive! Binary is 357x faster

### The Lesson:
As data grows, algorithm choice becomes CRITICAL. 
A well-chosen algorithm (O(log n)) beats a naive one (O(n)) dramatically.

## Data Points

**Linear Search Performance (Unsorted Data):**
- Time Complexity: O(n) - must check up to n elements
- Space Complexity: O(1) - no extra space needed
- Best for: Small datasets, one-time searches

**Binary Search Performance (Sorted Data):**
- Time Complexity: O(log n) - eliminates half of remaining elements
- Space Complexity: O(1) - no extra space needed
- Best for: Large datasets, multiple searches, sorted data

## Troubleshooting

**No result appearing after search?**
- Make sure you entered a valid number
- The number might not be in the array (this is fine - shows "Not Found")

**Comparisons seem high?**
- Check the array size setting
- Larger arrays naturally require more comparisons for linear search

**Want to search again?**
- Just enter a new search value and click "Perform Search"
- The array stays the same unless you change the size

## Building the Project

```bash
cd csu506-app
npm run build     # Compile TypeScript and create production build
npm run dev       # Start development server
npm run lint      # Check code quality
```

## File Structure

```
src/
├── searchUtils.ts           # Core algorithm implementations
├── SearchAlgorithmTool.tsx  # Interactive tool component
├── Project2Requirements.tsx # Requirements page
├── App.tsx                  # Updated main app with Project 2
└── ... other files
```

## Success Checklist

- ✓ Can access Project 02 from dashboard
- ✓ Can view requirements page
- ✓ Can open interactive tool
- ✓ Can select between Linear and Binary search
- ✓ Can adjust array size
- ✓ Can perform searches and see results
- ✓ Can run performance benchmarks
- ✓ Can view Big O analysis explanation
- ✓ Understand when to use each algorithm

## Next Steps

Once comfortable with the tool:
1. Document your findings in a 1-2 page analysis
2. Take screenshots of the tool with different data sizes
3. Create a recommendation guide for algorithm selection
4. Prepare to present findings on performance differences
