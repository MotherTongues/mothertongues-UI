import { constructTransducer } from './factories';

describe('transducer', () => {
    it('should be able to search', () => {
      const dummyTerms = ['dog', 'cat', 'frog', 'kart'];

      expect(
        constructTransducer({
          terms: dummyTerms,
          include_distance: false,
        }).transduce('kat', 1)
      ).toEqual(['cat', 'kart']);
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
      const dummyTerms = ['rat', 'cat', 'kit', 'Cat', 'Kart', 'kart'];

      const transducer = constructTransducer({
        terms: dummyTerms,
        include_distance: true,
        maximum_candidates: 10,
        case_insensitive_sort: false,
        sort_candidates: true
      });

      const result = transducer.transduce('kat', 2);

      expect(result.length).toEqual(dummyTerms.length);
      expect(result[0]).toEqual(['cat',1])
      expect(result[1]).toEqual(['Cat',1])
      expect(result[2]).toEqual(['kart', 1])
      expect(result[3]).toEqual(['kit', 1])
      expect(result[5]).toEqual(['Kart', 2])
    });
  });
  