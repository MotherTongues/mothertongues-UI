// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Builder } from 'liblevenshtein';
import { newStemmer } from 'snowball-stemmers';
import { DistanceCalculator } from './weighted.levenstein';
import { Counter } from './utils';
import {
  Alphabet,
  L1Index,
  L2Index,
  Location,
  RestrictedTransducer,
  SearchAlgorithms,
  StemmerEnum,
} from './mtd';

// From the MTD configuration for a normalization function, create a normalization function
// capable of lowercasing, unicode normalization, punctuation remove, and arbitrary replace rules.
export function create_normalization_function(
  config: RestrictedTransducer
): CallableFunction {
  const callables: CallableFunction[] = [];
  if (config.lower) {
    callables.push((string: string) => string.toLowerCase());
  }
  if (config.remove_combining_characters) {
    callables.push((text: string) =>
      text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
  }
  if (config.unicode_normalization && config.unicode_normalization !== 'none') {
    callables.push((text: string) =>
      text.normalize(config.unicode_normalization)
    );
  }
  if (config.remove_punctuation) {
    const regex = new RegExp(config.remove_punctuation, 'g');
    callables.push((text: string) => text.replace(regex, ''));
  }
  if (config.replace_rules) {
    const replace = (text: string) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Object.entries(config.replace_rules!).forEach(([k, v]) => {
        const regEx = new RegExp(k, 'g');
        text = text.replace(regEx, v);
      });
      return text;
    };
    callables.push(replace);
  }

  if (callables.length < 1) {
    return (string: string) => string;
  }

  return (text: string) => {
    callables.forEach((callable) => {
      text = callable(text);
    });
    return text;
  };
}

const englishSnowballStemmer = newStemmer('english');

export function englishStemmer(term: string): string {
  return englishSnowballStemmer.stem(term);
}

export interface MTDParams {
  transducer: Builder | object;
  index: Index;
  searchType: SearchAlgorithms;
  tokens: Alphabet | undefined;
}

interface BasicIndexParams {
  normalizeFunctionConfig?: RestrictedTransducer;
  stemmerFunctionChoice?: StemmerEnum;
  data: L1Index | L2Index;
}

export class Index {
  normalizeFunction: CallableFunction;
  stemmerFunction: CallableFunction | undefined;
  data: L1Index | L2Index = {};
  constructor({
    normalizeFunctionConfig = {
      lower: true,
      unicode_normalization: 'NFC',
      remove_punctuation: "[.,/#!$%^&?*';:{}=\\-_`~()]",
      replace_rules: {},
    },
    stemmerFunctionChoice = 'none',
    data,
  }: BasicIndexParams) {
    this.normalizeFunction = create_normalization_function(
      normalizeFunctionConfig
    );
    if (stemmerFunctionChoice === 'snowball_english') {
      this.stemmerFunction = englishSnowballStemmer.stem;
    } else {
      this.stemmerFunction = undefined;
    }
    this.data = data;
  }
}

export type Result = [
  distance: number,
  docID: string,
  location: Location,
  score: number
];

export function sortResults(results: Result[]) {
  return results.sort((a, b) => {
    // Sort by Levenstein distance first
    const n = a[0] - b[0];
    if (n !== 0) {
      return n;
    }
    // Then by BM25 score
    return b[3] - a[3];
  });
}

export class MTDSearch {
  index: Index;
  indexTerms: string[];
  transducer: Builder | DistanceCalculator;
  tokens: Alphabet | undefined;
  searchType: SearchAlgorithms;
  tokenizer: CallableFunction | undefined;

  constructor({ transducer, index, searchType, tokens }: MTDParams) {
    this.index = index;
    this.indexTerms = Object.keys(this.index.data);
    this.transducer = transducer;
    this.searchType = searchType;
    this.tokens = tokens;
    if (this.tokens !== undefined) {
      const sortedTokens = [...this.tokens].sort((a, b) => b.length - a.length);
      const regex = new RegExp('(' + sortedTokens.join('|') + ')', 'g');
      this.tokenizer = (str: string) => str.split(regex);
    } else {
      this.tokenizer = undefined;
    }
  }

  combine_results(flatResults: [string, number][]) {
    // But to calculate the average Lev distance and score we first create an object
    // This function only sums the Lev distances, so they need to be divided by the
    // number of query terms later
    const combinedResults: { [posting: string]: [number, Location, number] } =
      {};
    const docCounter = new Counter([]);
    for (const result of flatResults) {
      const term = result[0];
      const distance = result[1];
      const postings = Object.keys(this.index.data[term]);
      docCounter.update(postings);
      postings.forEach((posting) => {
        // Merge results in a single object
        if (posting in combinedResults) {
          combinedResults[posting][0] += distance;
          combinedResults[posting][1] = combinedResults[posting][1].concat(
            this.index.data[term][posting].location
          );
          combinedResults[posting][2] +=
            this.index.data[term][posting]['score']['total'];
        } else {
          combinedResults[posting] = [
            distance,
            this.index.data[term][posting].location,
            this.index.data[term][posting].score['total'],
          ];
        }
      });
    }
    return { combinedResults, docCounter };
  }

  search(query: string, maximum_edit_distance = 2, sort = false) {
    const splitQueryTerms = query.split(/\s+/);
    const matchSets: { [key: string]: Set<string> } = {};
    const results: [string, number][][] = splitQueryTerms.map((word) => {
      // normalize
      word = this.index.normalizeFunction(word);
      // stem
      if (this.index.stemmerFunction !== undefined) {
        word = this.index.stemmerFunction(word);
      }
      if (this.searchType === 'weighted_levenstein') {
        if (this.tokenizer !== undefined) {
          word = this.tokenizer(word);
          return this.indexTerms
            .map((term) => [
              term,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.transducer.getEditDistance(word, this.tokenizer!(term)),
            ])
            .filter((result) => result[1] < maximum_edit_distance);
        } else {
          return this.indexTerms
            .map((term) => [term, this.transducer.getEditDistance(word, term)])
            .filter((result) => result[1] < maximum_edit_distance);
        }
      } else {
        return this.transducer.transduce(word, maximum_edit_distance);
      }
    });
    // create sets of document ids for each query term for multi-word queries
    results.forEach((word, i) => {
      matchSets[splitQueryTerms[i]] = new Set(
        word.map((x) => Object.keys(this.index.data[x[0]])).flat()
      );
    });
    // Flatten multi-query results
    const flatResults = results.flat();
    // Combine the results by averaging the edit distance and summing the BM25 scores
    const { combinedResults, docCounter } = this.combine_results(flatResults);
    // We return a list of Results
    const resultsArray: Result[] = Object.keys(combinedResults).map(
      (posting) => {
        return [
          // if the doc was not found by any of the query terms, add an upper-bound default of the max edit distance + 1 for the
          // un-matched query terms and then average the results
          (combinedResults[posting][0] +
            Math.max(0, splitQueryTerms.length - docCounter.counter[posting]) *
              (maximum_edit_distance + 1)) /
            splitQueryTerms.length,
          posting,
          combinedResults[posting][1],
          combinedResults[posting][2],
        ];
      }
    );
    if (sort) {
      if (maximum_edit_distance === 0) {
        // if max edit distance is 0
        // just sort by score
        return resultsArray.sort((a, b) => b[3] - a[3]);
      } else {
        // Sort by Lev Distance first
        // then by BM25 score
        return sortResults(resultsArray);
      }
    } else {
      return resultsArray;
    }
  }
}
