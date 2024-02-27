import { constructTransducer } from './factories';

describe('transducer', () => {
    it('should be able to search', () => {
      const dummyTerms = ['dog', 'cat'];

      expect(
        constructTransducer({
          terms: dummyTerms,
          include_distance: false,
        }).transduce('kat', 1)
      ).toContain('cat');
    });

    it('should return only maximum number of candidates', () => {
      const dummyTerms = ['rat', 'cat', 'bat', 'fat', 'mat', 'pat'];

      const transducer = constructTransducer({
        terms: dummyTerms,
        include_distance: false,
        maximum_candidates: 2
      });

      const result = transducer.transduce('kat', 1);

      expect(result.length).toEqual(2);
    });
  });
  