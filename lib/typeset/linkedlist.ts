export type Node<T> = T;

function makeNode<T>(data: T): Node<T> {
  return data;
}

export class LinkedList<T> {
  array: T[];

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
    this.array.splice(ix, 0, data);
  }

  pushNew(data: T) {
    this.array.push(data);
  }

  remove(ix: number) {
    this.array.splice(ix, 1);
  }
}
