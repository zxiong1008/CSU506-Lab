# Project 5 Implementation: Hash Table and Heap-Based Priority Queue

## Overview

This project implements two fundamental data structures used widely in computing science and application development: a hash table and a priority queue built from a binary heap. The solution focuses on correct behavior, collision handling, and performance measurement using at least 100 data items to demonstrate how the hash table outperforms linear search.

## File Structure

- `hash_table.py` — contains the `HashTable` class and a performance comparison helper.
- `priority_queue.py` — contains the `PriorityQueue` class built on a binary heap.
- `project5_demo.py` — demonstrates insert/search/delete behavior and measures performance.
- `PROJECT_5_ANALYSIS.md` — explains the hash function choice and collision handling.
- `PROJECT_5_HASHING_GUIDE.md` — describes perfect vs. non-perfect hashing using examples.

## Hash Table Design

The hash table uses chaining to resolve collisions. Each bucket stores a dictionary of key-value pairs, so when two different keys map to the same index, both values remain stored in the same bucket instead of overwriting each other. The hash function is a weighted sum of the character codes in the key string, reduced modulo the table size.

The design keeps the implementation simple but effective:

- `insert(key, value)` stores a new pair.
- `search(key)` returns the associated value in O(1) average time.
- `delete(key)` removes the key-value pair.
- `contains(key)` checks membership.
- `size` tracks the number of entries stored.

## Priority Queue Design

The priority queue is a binary heap stored in a Python list. The root is the highest-priority item, so `peek()` returns that item immediately. The heap property is maintained with `sift_up()` and `sift_down()`, which preserve ordering after insertion and extraction.

Operations include:

- `insert(item, priority)`
- `peek()`
- `extract_max()`
- `extract_min()`
- `search(item)`
- `delete(item)`

## Performance Validation

The project includes a comparison function that creates 200 records, searches for the same data using the hash table and a linear scan, and measures elapsed time. The hash table typically performs much faster because it reduces lookup from O(n) to average-case O(1).

## Expected Outcome

The system satisfies the requirement that the hash table correctly stores and retrieves key-value pairs, handles duplicates in the hash index, and demonstrates clear performance benefits over linear search. The heap-based priority queue correctly prioritizes tasks by urgency and maintains a valid heap ordering.
