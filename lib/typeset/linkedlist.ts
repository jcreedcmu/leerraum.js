let idCounter = 0;

export class Node<T> {
  id: number;
  prev: any;
  private _next: any;
  data: T;

  constructor(data: T) {
    this.prev = null;
    this._next = null;
    this.data = data;
    this.id = idCounter++;
  }

  toString() {
    return (this.data as any).toString();
  }

  getNext() { return this._next }

  setNext(x: any) { this._next = x }

}

export class LinkedList<T> {
  array: Node<T>[];
  head: Node<T> | null;
  tail: Node<T> | null;
  listSize: any;

  constructor() {
    this.array = [];
    this.head = null;
    this.tail = null;
    this.listSize = 0;
  }

  size(): number {
    return this.array.length;
  }

  isEmpty(): boolean {
    return this.array.length === 0;
  }

  first(): Node<T> | null {
    return this.array[0];
  }

  // Note that modifying the list during
  // iteration is not safe.
  forEach(fun: (x: Node<T>) => void) {
    this.array.forEach(fun);
  }

  insertBefore(node: Node<T>, newNode: Node<T>) {
    newNode.prev = node.prev;
    newNode.setNext(node);
    if (node.prev === null) {
      this.head = newNode;
    } else {
      node.prev.setNext(newNode);
    }
    node.prev = newNode;
    this.listSize += 1;

    // array version
    const ix = this.array.findIndex(x => x.id == node.id);
    if (ix == -1) { console.log(`couldn't find node in insertBefore`); }
    this.array.splice(ix, 0, newNode);

    return this;
  }

  push(node: Node<T>) {
    node.prev = this.tail;
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      const tail = this.tail;
      if (tail === null) throw 'nope'; // shouldn't be that head is non-null but tail is null
      tail.setNext(node);
      this.tail = node;
    }
    this.listSize += 1;

    // array version
    this.array.push(node);

    return this;
  }

  remove(node: Node<T>) {
    if (node.prev === null) {
      this.head = node.getNext();
    } else {
      node.prev.setNext(node.getNext);
    }
    if (node.getNext() === null) {
      this.tail = node.prev;
    } else {
      node.getNext().prev = node.prev;
    }
    this.listSize -= 1;

    // array version
    const ix = this.array.findIndex(x => x.id == node.id);
    if (ix == -1) { console.log(`couldn't find node in remove`); }
    this.array.splice(ix, 1);

    return this;
  }

  next<T>(node: Node<T>) {
    return node.getNext();
  }
}
