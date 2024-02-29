import { DistanceCalculator } from "./weighted.levenstein";

describe('DistanceCalculator', () => {
    describe('getSubstitutionCost', () => {
        it('should return 0 for identical characters', () => {
        const calculator = new DistanceCalculator({});
        const result = calculator.getSubstitutionCost('a', 'a');
        expect(result).toBe(0);
        });
    
        it('should use default substitution cost when no specific cost is provided', () => {
        const calculator = new DistanceCalculator({});
        const result = calculator.getSubstitutionCost('a', 'b');
        expect(result).toBe(1.0); // Assuming defaultSubstitutionCost is 1.0
        });
        
        it('should use default substitution cost when no specific cost is provided', () => {
            const calculator = new DistanceCalculator({
                defaultSubstitutionCost: .5
              });
            const result = calculator.getSubstitutionCost('a', 'b');
            expect(result).toBe(.5);
        });
    });

    describe('getEditDistance', () => {
        it('should return length if one input is empty string', () => {
            const calculator = new DistanceCalculator({});

            expect(calculator.getEditDistance('', 'happy')).toBe(5);
            expect(calculator.getEditDistance('days', '')).toBe(4);

        });

        it('should calculate edit distance correctly', () => {
          const calculator = new DistanceCalculator({
            insertionCost: 1,
            deletionCost: 1,
            insertionAtBeginningCost: 0.5,
            deletionAtEndCost: 0.5,
            substitutionCosts: {},
            defaultSubstitutionCost: 1,
          });
      
          expect(calculator.getEditDistance('hello', 'world')).toBe(4);

          expect(calculator.getEditDistance('sitting', 'kitten')).toBe(3);
          expect(calculator.getEditDistance('kitten', 'sitting')).toBe(2.5);
          
          // TODO: Add more test cases 
        });
    });

    // describe('getLeastEditDistance', () => {
    //     it('should calculate least edit distance correctly', () => {
    //       const calculator = new DistanceCalculator({
    //         insertionCost: 1,
    //         deletionCost: 1,
    //         insertionAtBeginningCost: 0.5,
    //         deletionAtEndCost: 0.5,
    //         substitutionCosts: {},
    //         defaultSubstitutionCost: 1,
    //       });
      
    //       const bs1 = ['kitten', 'sitting'];
    //       const bs2 = ['hello', 'world'];
    //       expect(calculator.getLeastEditDistance('kitten', bs1)).toEqual(3);
    //       expect(calculator.getLeastEditDistance('hello', bs2)).toEqual(4);
          
    //       // TODO: Add more test cases as needed
    //     });
    // });
});