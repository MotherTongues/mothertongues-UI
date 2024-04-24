import { constructSearchers, constructTransducer } from './factories';
import {
  MTDExportFormat,
  L1Index,
  L2Index,
  LanguageConfigurationExportFormat,
} from './mtd';
import index1 from '../../testdata/search_L1EngIndex_numbers.json';
import index2 from '../../testdata/search_L1EngIndex_numbers.json';
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

  it('should be able to search with edit distance based on tokens from substitution costs', () => {
    // @ts-ignore
    const l1_index_english_numbers: L1Index = index1;
    // @ts-ignore
    const l2_index_english_numbers: L2Index = index2;
    const exportedData: MTDExportFormat = {
      config: {
        L1: 'Test',
        L2: 'test',
        l1_search_config: {
          substitutionCosts: { foo: { one: 0.0 }, one: { foo: 0.0 } },
        },
        l1_search_strategy: 'weighted_levenstein',
        l2_search_strategy: 'weighted_levenstein',
        l1_stemmer: 'none',
        l2_stemmer: 'none',
        l1_normalization_transducer: {},
        l2_normalization_transducer: {},
        build: 'test',
        optional_field_name: 'optional',
        alphabet: [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z',
        ],
      },
      data: [
        { word: 'test', definition: 'test', entryID: '0', sorting_form: [0] },
      ],
      l1_index: l1_index_english_numbers,
      l2_index: l2_index_english_numbers,
    };
    const [l1_searcher, l2_searcher] = constructSearchers(exportedData);
    expect(l1_searcher.search('one', 1, true).length).toEqual(4);
    expect(l1_searcher.search('foo', 1, true).length).toEqual(4); // If foo and one are both equivalent according to the substitution costs, then the edit distance should be calculated on that and 'foo' becomes essentially an alias for 'one'
    expect(l1_searcher.search('foo', 1, true)).toEqual(
      l1_searcher.search('one', 1, true)
    );
  });

  it('should return only maximum number of candidates in alphabetical order', () => {
    const dummyTerms = ['rat', 'cat', 'bat', 'mat', 'hat', 'pat'];

    const transducer = constructTransducer({
      terms: dummyTerms,
      include_distance: false,
      maximum_candidates: 3,
    });

    const result = transducer.transduce('kat', 1);

    expect(result.length).toEqual(3);
    expect(result[0]).toEqual('bat');
    expect(result[1]).toEqual('cat');
    expect(result[2]).toEqual('hat');
  });

  it('should return only maximum number of candidates sorted by distance THEN alphabetized', () => {
    const dummyTerms = ['rat', 'cat', 'kit', 'Cat', 'Kart', 'kart'];

    const transducer = constructTransducer({
      terms: dummyTerms,
      include_distance: true,
      maximum_candidates: 10,
      case_insensitive_sort: false,
      sort_candidates: true,
    });

    const result = transducer.transduce('kat', 2);

    expect(result.length).toEqual(dummyTerms.length);
    expect(result[0]).toEqual(['cat', 1]);
    expect(result[1]).toEqual(['Cat', 1]);
    expect(result[2]).toEqual(['kart', 1]);
    expect(result[3]).toEqual(['kit', 1]);
    expect(result[5]).toEqual(['Kart', 2]);
  });
});
