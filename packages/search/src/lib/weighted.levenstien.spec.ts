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

        it('should calculate edit distance with defaults correctly', () => {
          const calculator = new DistanceCalculator({});
      
          expect(calculator.getEditDistance('hello', 'world')).toBe(4);

          expect(calculator.getEditDistance('sitting', 'kitten')).toBe(3);
          expect(calculator.getEditDistance('kitten', 'sitting')).toBe(2.5);
        });

        it('should calculate edit distance with custom sub values correctly', () => {
            const calculator = new DistanceCalculator({
                insertionCost: .25,
                deletionCost: .8,
                insertionAtBeginningCost: 0.75,
                deletionAtEndCost: 0.6,
                substitutionCosts: {},
                defaultSubstitutionCost: .45,
            });
        
            // insertion
            expect(calculator.getEditDistance('hat', 'that')).toBe(.75);
            expect(calculator.getEditDistance('cart', 'cat')).toBe(.25);

            // deletion
            expect(calculator.getEditDistance('hat', 'hats')).toBe(.6);
            expect(calculator.getEditDistance('cat', 'cart')).toBe(.8);

            // substitution
            expect(calculator.getEditDistance('bat', 'bet')).toBe(.45);
        });

        it('should create calculator that favors affixation', () => {
            const calculator_withEndDeletion_lowValue = new DistanceCalculator({
                deletionAtEndCost: 0.1
            });

            const v1 = calculator_withEndDeletion_lowValue.getEditDistance('happy', 'happiness');
            expect(calculator_withEndDeletion_lowValue.getEditDistance('happy', 'poppy')).toBe(2);

            const calculator_defaultValues = new DistanceCalculator({});
            const v2 = calculator_defaultValues.getEditDistance('happy', 'happiness');

            expect(v1).toBeLessThan(v2);

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
    //       expect(calculator.getLeastEditDistance('kitten', bs1)).toBe(2.5);
    //       expect(calculator.getLeastEditDistance('hello', bs2)).toBe(4);
          
    //       // TODO: Add more test cases as needed
    //     });
    // });
});