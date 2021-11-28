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

  last(): Node<T> | null {
    return this.tail;
  }

  toString(): string {
    return this.toArray().toString();
  }

  toArray() {
    var node = this.head;
    const result: any[] = [];
    while (node !== null) {
      result.push(node);
      node = node.next;
    }
    return result;
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

  contains(n) {
    var node = this.head;
    if (!this.isLinked(n)) {
      return false;
    }
    while (node !== null) {
      if (node === n) {
        return true;
      }
      node = node.next;
    }
    return false;
  }

  at(i) {
    var node = this.head, index = 0;

    if (i >= this.listSize || i < 0) {
      return null;
    }

    while (node !== null) {
      if (i === index) {
        return node;
      }
      node = node.next;
      index += 1;
    }
    return null;
  }

  insertAfter(node, newNode) {
    if (!this.isLinked(node)) {
      return this;
    }
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next === null) {
      this.tail = newNode;
    } else {
      node.next.prev = newNode;
    }
    node.next = newNode;
    this.listSize += 1;
    return this;
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
    if (this.head === null) {
      this.unshift(node);
    } else {
      this.insertAfter(this.tail, node);
    }
    return this;
  }

  unshift(node) {
    if (this.head === null) {
      this.head = node;
      this.tail = node;
      node.prev = null;
      node.next = null;
      this.listSize += 1;
    } else {
      this.insertBefore(this.head, node);
    }
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
