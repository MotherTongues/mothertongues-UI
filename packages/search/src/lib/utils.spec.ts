import { Counter } from "./utils";

describe('Counter', () => {
    it('should correctly update the counter', () => {
      const array = ['apple', 'banana', 'apple', 'cherry'];
      const counter = new Counter(array);
  
      expect(counter.counter).toEqual({
        apple: 2,
        banana: 1,
        cherry: 1,
      });
    });
  
    it('should increment the count when adding repeat value', () => {
      const counter = new Counter([]);
      counter.add('apple');
      counter.add('apple');
  
      expect(counter.counter.apple).toBe(2);
    });

    it('should increment the count when adding already existing value', () => {
        const counter = new Counter(['apple']);
        counter.add('apple');
    
        expect(counter.counter.apple).toBe(2);
      });
  
    it('should handle an empty array', () => {
      const counter = new Counter([]);
      expect(counter.counter).toEqual({});
    });
  });