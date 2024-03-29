import { create_normalization_function, englishStemmer, sortResults, Result, MTDSearch, Index, MTDParams } from './search';
import { DistanceCalculator } from './weighted.levenstein';
import index1 from '../../testdata/search_L1EngIndex_numbers.json';
import index2 from '../../testdata/search_L2EspIndex_numbers.json';
import { L1Index, L2Index } from './mtd';

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

describe('Index', () => {
  it('should work with empty data', () => {
    const basicIndexParams = {
      data: {}
    }
    const index = new Index(basicIndexParams);

    expect(index.data).toEqual({});
  });

  it('should construct w given data', () => {
    const basicIndexParams = {
      data: {'one': {}}
    }
    const index = new Index(basicIndexParams);

    expect(index.data).toEqual({'one': {}});
  });
});

describe('MTDSearch class', () => {

  let mtdSearch: MTDSearch;

  const basicIndexParams = {
    data: {'one': {}, 'two': {}}
  }

  const mtdParams: MTDParams = {
    transducer: {},
    index: new Index(basicIndexParams),
    searchType: 'weighted_levenstein',
    tokens: undefined
  }

  beforeEach(() => {
    mtdSearch = new MTDSearch(mtdParams);
  })

  it('should construct with undefined tokens', () => {
    // arrange
    mtdSearch = new MTDSearch(mtdParams)

    // act + assert
    expect(mtdSearch.indexTerms).toEqual(['one','two']);
    expect(mtdSearch.tokenizer).toEqual(undefined);
  });

  it('should construct with defined tokens', () => {
    // arrange
    mtdParams.tokens = ['a','b','c']
    mtdSearch = new MTDSearch(mtdParams)
  
    // act + assert
    expect(mtdSearch.indexTerms).toEqual(['one','two']);
    expect(mtdSearch.tokenizer).not.toEqual(undefined);
  });

  // describe('combine_results method', () => {
  //   it('should return no results if search term does not have defined Index data', () => {

  //     const result = mtdSearch.combine_results([['one', 0]]);
  //     expect(result).toEqual([]);

  //   });
  // });

  describe('search method', () => {

    const l1_index_english_numbers: L1Index = index1;
    const l2_index_spanish_numbers = index2;

    it('should return correct search results for single word query', () => {
      const query = 'one'; 
      const maximum_edit_distance = 2;
      const sort = false;
  
      mtdParams.transducer = new DistanceCalculator({});
      mtdParams.tokens = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

      mtdParams.index.data = l1_index_english_numbers;
      mtdSearch = new MTDSearch(mtdParams);

      const result = mtdSearch.search(query, maximum_edit_distance, sort);
      const expectedResult = [
        [0,"DataNamedThis00",[["word",0,],],0.4423756753387274,],
        [0,"DataNamedThis05",[["word",1,],],0.3305391282025323,],
        [0,"DataNamedThis08",[["word",0,],],0.3305391282025323,],
        [0,"DataNamedThis09",[["word",0,],["word",2,],],0.4100067234846742,]
      ];
  
      // of the 10 given terms, only 4 should be returned
      expect(result.length).toEqual(4);
      expect(result).toEqual(expectedResult);
    });
  });

  it('should return correct results for multi-word query', () => {
    const query = 'two hundred';
    const maximum_edit_distance = 2;
    const sort = false;
  
    const result = mtdSearch.search(query, maximum_edit_distance, sort);
    const expectedResult = [
      [1.5,"DataNamedThis01",[["word",0,],],2.220543387065661,],
      [1.5,"DataNamedThis08",[["word",1,],],1.1000228598850477,],
      [1.5,"DataNamedThis09",[["word",1,],],0.8780451527333565,]
    ];
  
    // of the 10 given terms, only 3 should be returned
    expect(result.length).toEqual(3);
    expect(result).toEqual(expectedResult);
  });
  
  // it('should return correct results for single non-existent word query', () => {
  //   const query = 'nonExistentWord';
  //   const maximum_edit_distance = 2;
  //   const sort = false;
  
  //   const result = mtdSearch.search(query, maximum_edit_distance, sort);
  //   const expectedResult = [ /* expected result for 'nonexistant word' */ ];
  
  //   expect(result).toEqual(expectedResult);
  // });

  // it('should return correct results for multi-word query containing non-existent word', () => {
  //   const query = 'one nonExistentWord';
  //   const maximum_edit_distance = 2;
  //   const sort = false;
  
  //   const result = mtdSearch.search(query, maximum_edit_distance, sort);
  //   const expectedResult = [ /* expected result for 'one, 'nonexistant word' */ ];
  
  //   expect(result).toEqual(expectedResult);
  // });
  


  // it('should return correct results for query with maximum edit distance', () => {
  //   const query = 'one';
  //   const maximum_edit_distance = 0;
  //   const sort = false;
  
  //   const result = mtdSearch.search(query, maximum_edit_distance, sort);
  //   const expectedResult = [ /* expected result for 'one' */ ];
  
  //   expect(result).toEqual(expectedResult);
  // });
  

  // it('should return correct results for query with sort option', () => {
  //   const query = 'one two';
  //   const maximum_edit_distance = 2;
  //   const sort = true;
  
  //   const result = mtdSearch.search(query, maximum_edit_distance, sort);
  //   const expectedResult = [ /* expected sorted result for 'one' and 'two' */ ];
  
  //   expect(result).toEqual(expectedResult);
  // });
  

});

