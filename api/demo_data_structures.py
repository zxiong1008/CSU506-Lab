from data_structures import (
    Deque,
    LinkedList,
    Queue,
    Stack,
    are_delimiters_balanced,
    benchmark_operations,
    is_palindrome,
    remove_duplicates,
    round_robin_schedule,
)


def main() -> None:
    print("STACK (LIFO)")
    stack = Stack(["A", "B"])
    print("Initial:", stack.display())
    stack.push("C")
    print("push('C'):", stack.display())
    print("peek():", stack.peek())
    print("pop():", stack.pop())
    print("After pop:", stack.display())
    print("isEmpty():", stack.isEmpty())

    print("\nQUEUE (FIFO)")
    queue = Queue(["A", "B"])
    print("Initial:", queue.display())
    queue.enqueue("C")
    print("enqueue('C'):", queue.display())
    print("front():", queue.front())
    print("dequeue():", queue.dequeue())
    print("After dequeue:", queue.display())
    print("isEmpty():", queue.isEmpty())

    print("\nDEQUE (BOTH ENDS)")
    deque = Deque([2])
    print("Initial:", deque.display())
    deque.addFront(1)
    print("addFront(1):", deque.display())
    deque.addRear(3)
    print("addRear(3):", deque.display())
    print("removeFront():", deque.removeFront())
    print("removeRear():", deque.removeRear())
    print("After removals:", deque.display())
    print("isEmpty():", deque.isEmpty())

    print("\nLINKED LIST")
    linked_list = LinkedList([1, 2])
    print("Initial:", linked_list.display())
    linked_list.insert(0)
    print("insert(0):", linked_list.display())
    print("search(2):", linked_list.search(2))
    print("delete(1):", linked_list.delete(1))
    print("After delete:", linked_list.display())
    print("isEmpty():", len(linked_list) == 0)

    print("\nPROBLEM-SOLVING EXAMPLES")
    print("Balanced delimiters {[()]}:", are_delimiters_balanced("{[()]" + "}"))
    print("Round-robin schedule:", round_robin_schedule(["Task A", "Task B"], 4))
    print("Palindrome check:", is_palindrome("A man, a plan, a canal: Panama"))
    print("Remove duplicates:", remove_duplicates([3, 1, 3, 2, 1]))
    print("Benchmark results:")
    for name, result in benchmark_operations(20).items():
        print(f"  {name}: {result}")


if __name__ == "__main__":
    main()