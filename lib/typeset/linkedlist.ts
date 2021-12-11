let idCounter = 0;

function makeNode<T>(data: T): Node<T> {
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

  first(): Node<T> | null {
    return this.array[0];
  }

  forEach(fun: (x: Node<T>) => void) {
    this.array.forEach(fun);
  }

  insertBeforeNew(ix: number, data: T) {
    this.array.splice(ix, 0, new Node(data));
  }

  pushNew(data: T) {
    this.array.push(new Node(data));
  }

  remove(ix: number) {
    this.array.splice(ix, 1);
  }
}
