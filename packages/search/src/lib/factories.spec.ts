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

    it('should return only maximum number of candidates in alphabetical order', () => {
      const dummyTerms = ['rat', 'cat', 'bat', 'mat', 'hat', 'pat'];

      const transducer = constructTransducer({
        terms: dummyTerms,
        include_distance: false,
        maximum_candidates: 3
      });

      const result = transducer.transduce('kat', 1);

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('bat');
      expect(result[1]).toEqual('cat');
      expect(result[2]).toEqual('hat');
    });

    it('should return only maximum number of candidates in order they were given', () => {
      const dummyTerms = ['rat', 'cat', 'bat', 'mat', 'hat', 'pat'];

      const transducer = constructTransducer({
        terms: dummyTerms,
        include_distance: false,
        maximum_candidates: 3,
        sort_candidates: false
      });

      const result = transducer.transduce('kat', 1);

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('rat')
      expect(result[1]).toEqual('cat')
      expect(result[2]).toEqual('bat')
    });
  });
  