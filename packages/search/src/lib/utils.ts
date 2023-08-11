export class Counter {
    counter: {[key: string]: number} = {};
    constructor(array: string[]) {
      this.update(array);
    }
    add = (val: string) => {
        this.counter[val] = (this.counter[val] || 0) + 1;
    };
    update = (array: string[]) => {
        array.forEach((val) => this.add(val));
    };
  }