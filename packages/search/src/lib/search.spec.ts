import {
  constructTransducer,
  create_normalization_function,
  englishStemmer,
} from './search';

describe('stemmer', () => {
  it('should do basic stemming', () => {
    expect(englishStemmer('relation')).toEqual('relat');
  });
});

describe('normalize', () => {
  it('should lowercase', () => {
    const defaultNormalization = create_normalization_function({
      lower: true,
      unicode_normalization: 'NFC',
      replace_rules: [],
      remove_punctuation: "[.,/#!$%^&?*';:{}=\\-_`~()]",
    });
    expect(defaultNormalization('rElAtE')).toEqual('relate');
  });
});

describe('normalize', () => {
  it('should remove punctuation', () => {
    const defaultNormalization = create_normalization_function({
      lower: true,
      unicode_normalization: 'NFC',
      replace_rules: [],
      remove_punctuation: "[.,/#!$%^&?*';:{}=\\-_`~()]",
    });
    expect(defaultNormalization('rElAtE,;')).toEqual('relate');
  });
});

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
