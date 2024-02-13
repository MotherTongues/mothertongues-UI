import { constructTransducer } from './factories';

describe('transducer', () => {
    const dummyTerms = ['dog', 'cat'];
    it('should be able to search', () => {
      expect(
        constructTransducer({
          terms: dummyTerms,
          include_distance: false,
        }).transduce('kat', 1)
      ).toContain('cat');
    });
  });
  