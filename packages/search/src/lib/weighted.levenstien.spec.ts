import { DistanceCalculator } from "./weighted.levenstein";

describe('DistanceCalculator', () => {
    describe('getSubstitutionCost', () => {
        it('should return 0 for identical characters', () => {
        const calculator = new DistanceCalculator({});
        const result = calculator.getSubstitutionCost('a', 'a');
        expect(result).toBe(0);
        });
    
        // Add more test cases for other methods and scenarios
        // ...
    
        it('should use default substitution cost when no specific cost is provided', () => {
        const calculator = new DistanceCalculator({});
        const result = calculator.getSubstitutionCost('a', 'b');
        expect(result).toBe(1.0); // Assuming defaultSubstitutionCost is 1.0
        });
    })
  });