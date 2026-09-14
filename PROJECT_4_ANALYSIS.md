# Project 4 Analysis: Choosing a Linear Data Structure

Linear structures keep data in a sequence, but the rule used to access that sequence changes the algorithmic behavior. The best choice depends on which item must be accessed first, where changes happen, and whether predictable memory layout matters.

## Stack

A Stack follows last-in, first-out (LIFO) order. The newest item is the next item removed, so `push`, `pop`, and `peek` are O(1) when the top is the end of a Python list. This makes a stack a natural model for undo history, browser back navigation, function-call frames, and delimiter matching. Its main limitation is intentional: it does not provide fair access to older items. Searching for an arbitrary value is O(n), and using a stack for a first-come, first-served workflow would be the wrong abstraction.

## Queue

A Queue follows first-in, first-out (FIFO) order. Enqueueing at the rear is O(1), while this educational list-backed implementation uses `pop(0)` for dequeue, making removal O(n) because the remaining elements shift. A queue is appropriate for print jobs, task scheduling, breadth-first search, and message processing where fairness matters. In production Python, `collections.deque` is preferable when frequent front removal is required because it provides efficient operations at both ends.

## Deque

A Deque supports insertion and removal at both the front and rear. It is more flexible than a stack or queue and can model either one depending on which end is used. The Project 4 palindrome example removes one character from each end, which directly matches the problem. A deque is also useful for sliding-window algorithms and work-stealing schedulers. With a Python list, front operations are O(n) because elements shift; a linked or block-based deque implementation can reduce that cost.

## Linked list

A singly LinkedList stores nodes connected by references. Inserting at the head is O(1), and deleting a known head node is O(1). However, finding a value or deleting the first matching value requires a traversal and is O(n). Each node has link overhead and poor cache locality compared with a contiguous list. Linked lists make sense when frequent structural changes occur at known positions or when the lesson is about pointer-based organization. They are usually not the fastest default for indexed access or search.

## Performance comparison

| Structure | Primary strength | Representative operation | Time in this implementation | Extra space |
| --- | --- | --- | --- | --- |
| Stack | LIFO access | push / pop / peek | O(1) | O(n) |
| Queue | FIFO access | enqueue / dequeue | O(1) / O(n) | O(n) |
| Deque | Both ends | addRear / removeRear | O(1) / O(n) front | O(n) |
| LinkedList | Head insertion | insert / search | O(1) / O(n) | O(n) plus node links |

The measured benchmark is useful as evidence, but its milliseconds depend on the machine and runtime. Big-O explains how the cost changes as the collection grows; it should be combined with operation frequency, memory locality, and the required access rule. The practical selection rule is simple: choose Stack for reversal and nesting, Queue for fairness, Deque for two-ended workflows, and LinkedList for node-oriented changes at known positions.
