# CSU 506 Final Portfolio Report

## Executive Summary
This portfolio demonstrates the complete design and analysis of algorithms learning journey across the course. It unifies core topics including sorting, selection, sets, recursion, graph traversal, and the major linear and nonlinear data structures explored in previous modules. The system is designed to showcase both conceptual understanding and practical implementation by combining an API layer, a visual interface, and performance-focused analysis.

## 1. Project Scope and Learning Outcomes
The final project required the implementation of a complete portfolio system covering:
- Bubble sort with step-by-step visualization.
- Quickselect for kth smallest element selection.
- A complete Set class with union, intersection, difference, and symmetric difference.
- Integration of stacks, queues, trees, graphs, and hash tables.
- A user interface for testing and comparing algorithms and structures.
- Performance analysis across algorithmic trade-offs.

This portfolio system addresses each requirement while reinforcing the relationship between mathematical complexity and practical runtime behavior.

## 2. Implementation Design
### Algorithms
The bubble sort implementation demonstrates how repeated pairwise comparisons settle the largest unsorted values from the end of the array. The quickselect algorithm reduces the problem to partitioning around a pivot so that only the relevant side of the array is searched, yielding average-case O(n) time for kth selection.

### Set Model
The custom Set class supports the required operations by leveraging the set semantics of unique values. This highlights the difference between static mathematical sets and dynamic collections in software implementation.

### Integration Strategy
The final system brings together all prior data structures by organizing them into one course-wide portfolio: stack, queue, deque, linked list, priority queue, hash table, binary search tree, and graph. This integration makes the project more than a collection of isolated labs; it becomes a unified narrative of algorithm and data-structure reasoning.

## 3. Performance Analysis
Bubble sort is conceptually simple and easy to visualize, but it scales poorly for large datasets because each pass compares neighboring values in O(n²) time in the worst case. Quickselect is more efficient on selection tasks because it avoids sorting the full list; on average it performs in linear time, though worst-case partition choices can degrade under poor pivot selection.

Set operations are efficient when implemented with hashing or logical set semantics because membership, union, and intersection may be reduced to near O(n) average-case work. Data structures such as hash tables and graphs each optimize different access patterns: direct lookup for tables, FIFO semantics for queues, tree search for ordered data, and adjacency-based traversal for networks.

## 4. Interface and User Experience
The front-end portfolio tool present in the project provides an interactive environment where users can:
- visualize bubble sort as values move into their final positions,
- calculate the kth smallest element using quickselect,
- test set operations on small numeric collections,
- review core data structures and the course concepts they represent.

This makes the portfolio useful for demonstration, learning, and grading review, while also making the algorithmic behavior visible.

## 5. Documentation and Run Instructions
The project can be run using the local Python API and the Vite-based React app. The backend exposes final-project endpoints for sorting, selection, and set demonstrations, while the front-end links the interactive features into a polished portfolio interface.

## 6. Course Reflection
The final portfolio reflects the progression of the course: beginning with the abstractions of arrays and linked structures, moving through searching and sorting, and culminating in graph-based reasoning and system-level integration. The resulting project demonstrates not only code correctness but also the understanding of when to choose one algorithm or data structure over another based on constraints, performance, and intended behavior.

## 7. Conclusion
The final portfolio successfully satisfies the assignment requirements by combining conceptual mastery with delivered working implementations. It demonstrates practical understanding of algorithmic complexity, data-structure trade-offs, and the design of a user-facing teaching tool that communicates technical content clearly.
