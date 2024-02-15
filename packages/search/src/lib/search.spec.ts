import { create_normalization_function, englishStemmer, sortResults, Result } from './search';


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
      replace_rules: {},
      remove_punctuation: "[.,/#!$%^&?*';:{}=\\-_`~()]",
    });
    expect(defaultNormalization('rElAtE')).toEqual('relate');
  });

  it('should NOT lowercase', () => {
    const defaultNormalization = create_normalization_function({
      lower: false
    });
    expect(defaultNormalization('rElAtE')).toEqual('rElAtE');
  });

  it('should remove combining characters', () => {
    const defaultConfig = create_normalization_function({
      lower: false,
      remove_combining_characters: true,
    })
    expect(defaultConfig('ÁÉÍÓÚäëïöüÇÅ')).toEqual('AEIOUaeiouCA');
  });

  it('should remove combining characters and lowercase', () => {
    const defaultConfig = create_normalization_function({
      lower: true,
      remove_combining_characters: true,
    })
    expect(defaultConfig('ÁÉÍÓÚäëïöü')).toEqual('aeiouaeiou');
  });


  it('should remove punctuation listed by remove_punctionation', () => {
    const defaultNormalization = create_normalization_function({
      lower: true,
      unicode_normalization: 'NFC',
      replace_rules: {},
      remove_punctuation: "[.,/#!$%^&?*';:{}=\\-_`~()]",
    });
    expect(defaultNormalization('a,a;a...')).toEqual('aaa');
  });

  it('should NOT remove punctuation not in remove_punctionation', () => {
    const defaultNormalization = create_normalization_function({
      lower: true,
      unicode_normalization: 'NFC',
      replace_rules: {},
      remove_punctuation: "[.,]",
    });
    expect(defaultNormalization('a,a;a.:')).toEqual('aa;a:');
  });

  it('should replace according to rules', () => {
    const defaultNormalization = create_normalization_function({
      replace_rules: {
        'k':'c',
        'i':'a',
        's':'t'
      }
    });
    expect(defaultNormalization('kat')).toEqual('cat');
    expect(defaultNormalization('cat')).not.toEqual('kat');

    expect(defaultNormalization('this')).toEqual('that');
  });

  it('should not choke if asked to replace same letter', () => {
    const defaultNormalization = create_normalization_function({
      replace_rules: {
        'r':'r'
      }
    });
    expect(defaultNormalization('hammer')).toEqual('hammer');
  });

  it('should replace with last rule listed', () => {
    const defaultNormalization = create_normalization_function({
      replace_rules: {
        'r':'z',
        'r':'l'
      }
    });
    expect(defaultNormalization('hammerer')).toEqual('hammelel');
  });

  it('should replace mulitple letters', () => {
    const defaultNormalization = create_normalization_function({
      replace_rules: {
        'ch':'k',
        'r':'rr'
      }
    });
    expect(defaultNormalization('chip')).toEqual('kip');
    expect(defaultNormalization('hammerer')).toEqual('hammerrerr');
  });

  it('should do all of the things according to the config', () => {
    const defaultNormalization = create_normalization_function({
      lower: true,
      unicode_normalization: 'NFC',
      replace_rules: {
        'a':'e'
      },
      remove_punctuation: "[-']",
    });
    expect(defaultNormalization("A,j'a--")).toEqual('e,je');
  });

});

describe('sortResults', () => {
  it('should sort by Levenstein distance (first value)', () => {
    const result1: Result = [1, 'result1', [[ 'entryIndex', 2]], 1];
    const result2: Result = [0, 'result2', [[ 'entryIndex', 2]], 1];
    const result3: Result = [0.5, 'result3', [['entryIndex', 2]], 1];
      
    const givenArray = [result1, result2, result3]

    const sortResultsOutput = sortResults(givenArray);

    expect(sortResultsOutput[0]).toEqual(result2);
    expect(sortResultsOutput[1]).toEqual(result3);
    expect(sortResultsOutput[2]).toEqual(result1);
  });

  it('should sort by BM25 score (last value) when Levenstein distance is equal', () => {
    const result1: Result = [0, 'result1', [[ 'entryIndex', 2]], 1];
    const result2: Result = [0, 'result2', [[ 'entryIndex', 2]], 0];
    const result3: Result = [0, 'result3', [['entryIndex', 2]], .5];
      
    const givenArray = [result1, result2, result3]

    const sortResultsOutput = sortResults(givenArray);

    expect(sortResultsOutput[0]).toEqual(result1);
    expect(sortResultsOutput[1]).toEqual(result3);
    expect(sortResultsOutput[2]).toEqual(result2);
  });

  it('should sort by Lev score first, BM25 score second', () => {
    const result1: Result = [0, 'result1', [[ 'entryIndex', 2]], 1];
    const result2: Result = [0, 'result2', [[ 'entryIndex', 2]], 0];
    const result3: Result = [.5, 'result3', [['entryIndex', 2]], .5];
    const result4: Result = [.5, 'result4', [['entryIndex', 2]], 1];
      
    const givenArray = [result1, result2, result3, result4]

    const sortResultsOutput = sortResults(givenArray);

    expect(sortResultsOutput[0]).toEqual(result1);
    expect(sortResultsOutput[1]).toEqual(result2);
    expect(sortResultsOutput[2]).toEqual(result4);
    expect(sortResultsOutput[3]).toEqual(result3);
  });

  it('should not blow up if given an empty Result set', () => {      
    const givenArray: Result[] = []

    expect(sortResults(givenArray)).toEqual([]);
  });

});


//describe('MTDSearch class')
  // class has combine_results()
  // class has search

//describe('Index class')
