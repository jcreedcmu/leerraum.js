export class Node<T> {
  prev: any;
  next: any;
  data: T;

  constructor(data: T) {
    this.prev = null;
    this.next = null;
    this.data = data;
  }

  toString() {
    return (this.data as any).toString();
  }
}

export class LinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  listSize: any;

  constructor() {
    this.head = null;
    this.tail = null;
    this.listSize = 0;
  }


  isLinked(node: Node<T> | null): boolean {
    return !((node && node.prev === null && node.next === null && this.tail !== node && this.head !== node) || this.isEmpty());
  }

  size(): number {
    return this.listSize;
  }

  isEmpty(): boolean {
    return this.listSize === 0;
  }

  first(): Node<T> | null {
    return this.head;
  }

  // Note that modifying the list during
  // iteration is not safe.
  forEach(fun: (x: Node<T>) => void) {
    var node = this.head;
    while (node !== null) {
      fun(node);
      node = node.next;
    }
  }

  insertBefore(node, newNode) {
    if (!this.isLinked(node)) {
      return this;
    }
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev === null) {
      this.head = newNode;
    } else {
      node.prev.next = newNode;
    }
    node.prev = newNode;
    this.listSize += 1;
    return this;
  }

  push(node) {
    node.prev = this.tail;
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      const tail = this.tail;
      if (tail === null) throw 'nope'; // shouldn't be that head is non-null but tail is null
      tail.next = node;
      this.tail = node;
    }
    this.listSize += 1;
    return this;
  }

  remove(node) {
    if (!this.isLinked(node)) {
      return this;
    }
    if (node.prev === null) {
      this.head = node.next;
    } else {
      node.prev.next = node.next;
    }
    if (node.next === null) {
      this.tail = node.prev;
    } else {
      node.next.prev = node.prev;
    }
    this.listSize -= 1;
    return this;
  }
}
