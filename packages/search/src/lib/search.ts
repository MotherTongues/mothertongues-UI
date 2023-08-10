// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Builder } from "liblevenshtein"; 
import { newStemmer } from 'snowball-stemmers';
import { DistanceCalculator } from './weighted.levenstein';

export type Location = [
    entryIndex: string,
    positionIndex: number
]

export interface Posting {[entryID: string]: {location: Location[], score: {total: number}}}

export interface IndexInterface {
    [term: string]: Posting
}

export interface RestrictedTransducerConfig {
  lower: boolean
  unicode_normalization: 'NFC' | 'NFD' | 'NKFC' | 'NKFD' | 'none'
  remove_punctuation: string
  replace_rules: object[]
}

// From the MTD configuration for a normalization function, create a normalization function
// capable of lowercasing, unicode normalization, punctuation remove, and arbitrary replace rules.
export function create_normalization_function(config: RestrictedTransducerConfig): CallableFunction {  
  const callables: CallableFunction[] = []
    if (config.lower) {
      callables.push((string: string) => string.toLowerCase())
    }
    if (config.unicode_normalization && config.unicode_normalization !== 'none') {
      callables.push((text: string) => text.normalize(config.unicode_normalization) )
    }
    if (config.remove_punctuation) {
      const regex = new RegExp(config.remove_punctuation, 'g')
      callables.push((text: string) => text.replace(regex, ""))
    }
    if (config.replace_rules) {
      const replace = (text: string) => {
        Object.keys(config.replace_rules).forEach(([k, v]) => {
          text = text.replace(k, v)
        })
      }
      callables.push(replace)
    }

    if (callables.length < 1) {
      return (string: string) => string
    }

    return (text: string) => {
          callables.forEach((callable) => {
            text = callable(text)
          })
          return text
        };
}

const englishSnowballStemmer = newStemmer('english')

export function englishStemmer(term: string): string {
    return englishSnowballStemmer.stem(term)
}

export enum TransducerAlgorithmTypes {
  standard = 'standard',
  merge_and_split = 'merge_and_split',
  transposition = 'transposition'
}

export enum SearchTypes {
  weighted_levenstein = 'weighted_levenstein',
  liblevenstein_automata = "liblevenstein_automata"
}

export interface BuilderConstructionParams {
  terms: Index | string[];
  algorithm?: TransducerAlgorithmTypes;
  sort_candidates?: boolean;
  case_insensitive_sort?: boolean;
  include_distance?: boolean;
  maximum_candidates?: number;
}

export function constructTransducer({terms, algorithm = TransducerAlgorithmTypes.standard, sort_candidates = true, case_insensitive_sort = true, include_distance = true, maximum_candidates = 10}: BuilderConstructionParams) {
  if (!Array.isArray(terms)) {
    terms = Object.keys(terms.data)
  }
  const builder = new Builder()
    .dictionary(terms, false)  // generate spelling candidates from unsorted completion_list
    .algorithm(algorithm)          // use Levenshtein distance extended with transposition
    .sort_candidates(sort_candidates)               // sort the spelling candidates before returning them
    .case_insensitive_sort(case_insensitive_sort)         // ignore character-casing while sorting terms
    .include_distance(include_distance)             // keep distances
    .maximum_candidates(maximum_candidates);        // maximum number of candidates
  return builder.build();
}

export interface MTDParams {
  transducer: Builder | object;
  index: Index;
  searchType: SearchTypes;
}

interface BasicIndexParams {
  normalizeFunctionConfig?: RestrictedTransducerConfig,
  stemmerFunctionChoice?: "snowball_english" | "none",
  data: IndexInterface
}

export class Index {
  normalizeFunction: CallableFunction;
  stemmerFunction: CallableFunction | undefined;
  data: IndexInterface = {};
  constructor({normalizeFunctionConfig = {lower: true, unicode_normalization: "NFC", remove_punctuation: "[.,/#!$%^&?*';:{}=\\-_`~()]", replace_rules: []}, stemmerFunctionChoice = "none", data} : BasicIndexParams ) {
    this.normalizeFunction = create_normalization_function(normalizeFunctionConfig);
    if (stemmerFunctionChoice === 'snowball_english') {
      this.stemmerFunction = englishSnowballStemmer.stem;
    } else {
      this.stemmerFunction = undefined;
    }
    this.data = data;
  }

}

export type Result = [distance: number, docID: string, location: Location[], score: number]

export class MTDSearch {
  index: Index;
  indexTerms: string[];
  transducer: Builder | DistanceCalculator;
  searchType: SearchTypes;
 
  constructor({transducer, index, searchType}: MTDParams) {
    this.index = index;
    this.indexTerms = Object.keys(this.index.data)
    this.transducer = transducer;
    this.searchType = searchType;
  }

  search(query: string, maximum_edit_distance = 2, sort=false) {
    const splitQueryTerms = query.split(/\s+/)
    const matchSets: {[key: string]: Set<string>} = {}
    const results: [string, number][][] = splitQueryTerms.map((word) => {
      // normalize
      word = this.index.normalizeFunction(word)
      // stem
      if (this.index.stemmerFunction !== undefined) {
        word = this.index.stemmerFunction(word)
      }
      if (this.searchType === SearchTypes.weighted_levenstein) {
        return this.indexTerms.map((term) => [term, this.transducer.getEditDistance(word, term)]).filter((result) => result[1] < maximum_edit_distance).sort((a, b) => a[1] - b[1])
      } else {
        return this.transducer.transduce(word, maximum_edit_distance)
      }
    })
    console.log(this.indexTerms)
    console.log(results)
    // create sets of document ids for each query term for multi-word queries
    results.forEach((word, i) => {
      matchSets[splitQueryTerms[i]] = new Set(word.map((x) => Object.keys(this.index.data[x[0]])).flat());
    })
    console.log(results)
    const flatResults = results.flat()
    console.log(flatResults)
    const resultsObject: {[posting: string]: [number, Location[], number]} = {};
    for (const result of flatResults) {
      const term = result[0];
      const distance = result[1]
      const postings = Object.keys(this.index.data[term])
      postings.forEach((posting) => {
        
        // multiply score by number of docs that have at least one match / number of words
        // this prioritizes postings that have matches for multiple query terms
        // const docMatchScore = Object.values(matchSets).filter((x) => x.has(posting)).length / splitQueryTerms.length
        // Merge results in a single object
        if (posting in resultsObject) {
          resultsObject[posting][0] += distance
          resultsObject[posting][1] = resultsObject[posting][1].concat(this.index.data[term][posting].location)
          // resultsObject[posting][2] += this.index.data[term][posting].score * docMatchScore
          resultsObject[posting][2] += this.index.data[term][posting].score['total']
        } else {
          resultsObject[posting] = [distance, this.index.data[term][posting].location, this.index.data[term][posting].score['total']]
        }
    })
    
    }
    // TODO: this is messy, too many changes to the shapes of things, needs refactoring.
    const resultsArray: Result[] = Object.keys(resultsObject).map((posting) => [resultsObject[posting][0]/splitQueryTerms.length, posting, resultsObject[posting][1], resultsObject[posting][2]]);
    console.log(resultsArray.filter(x=> x[0] < 0.5).sort((a, b) => b[3] - a[3]))
    if (sort) {
      return resultsArray.sort((a, b) => b[3] - a[3])
    } else {
      return resultsArray
    }
    
  }
 
}