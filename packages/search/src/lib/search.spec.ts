import {  constructTransducer, defaultNormalization, englishStemmer } from './search';


describe('stemmer', () => {
  it('should do basic stemming', () => {
    expect(englishStemmer('relation')).toEqual('relate');
  });
});

describe('normalize', () => {
  it('should lowercase', () => {
    expect(defaultNormalization('rElAtE')).toEqual('relate');
  });
});

describe('normalize', () => {
  it('should remove punctuation', () => {
    expect(defaultNormalization('rElAtE,;')).toEqual('relate');
  });
});

describe('transducer', () => {
  const dummyTerms = ['dog', 'cat']
  it('should be able to search', () => {
    expect(constructTransducer({terms: dummyTerms, include_distance: false}).transduce('kat', 1)).toContain('cat');
  });
});

