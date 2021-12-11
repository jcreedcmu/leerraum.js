let idCounter = 0;

export function makeNode<T>(data: T): Node<T> {
  return new Node<T>(data);
}

export class Node<T> {
  id: number;
  data: T;

  constructor(data: T) {
    this.data = data;
    this.id = idCounter++;
  }

  toString() {
    return (this.data as any).toString();
  }
}

export class LinkedList<T> {
  array: Node<T>[];

  constructor() {
    this.array = [];
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
    const ix = this.array.findIndex(x => x.id == node.id);
    if (ix == -1) { console.log(`couldn't find node in insertBefore`); }
    this.array.splice(ix, 0, newNode);

    return this;
  }

  push(node: Node<T>) {
    this.array.push(node);

    return this;
  }

  remove(node: Node<T>) {
    const ix = this.array.findIndex(x => x.id == node.id);
    if (ix == -1) { console.log(`couldn't find node in remove`); }
    this.array.splice(ix, 1);

    return this;
  }

  next<T>(node: Node<T>) {
    const ix = this.array.findIndex(x => x.id == node.id);
    if (ix == -1 || ix == this.array.length - 1) { return null }

    return this.array[ix + 1];
  }
}
