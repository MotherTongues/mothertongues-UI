import { create_normalization_function, englishStemmer } from './search';


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


//describe('sortResults')

//describe('MTDSearch class')
  // class has combine_results()
  // class has search

//describe('Index class')
