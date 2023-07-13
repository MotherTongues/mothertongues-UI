// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Builder } from "liblevenshtein"; 
import { JSONPath } from 'jsonpath-plus';

export type Location = [
    entryIndex: string,
    positionIndex: number
]

export interface Posting {[entryID: string]: Location[]}

export interface IndexInterface {
    [term: string]: Posting
}

export function defaultNormalization(term: string): string {
    return term.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"")
}

export function englishStemmer(term: string): string {
    // Super basic stemmer influenced by list sourced from https://github.com/nextapps-de/flexsearch/blob/master/src/lang/en.js
    const stemmerTerms = {
        "ational": "ate",
        "iveness": "ive",
        "fulness": "ful",
        "ousness": "ous",
        "ization": "ize",
        "tional": "tion",
        "biliti": "ble",
        "icate": "ic",
        "ative": "",
        "alize": "al",
        "iciti": "ic",
        "entli": "ent",
        "ousli": "ous",
        "alism": "al",
        "ation": "ate",
        "aliti": "al",
        "iviti": "ive",
        "ement": "",
        "enci": "ence",
        "anci": "ance",
        "izer": "ize",
        "alli": "al",
        "ator": "ate",
        "logi": "log",
        "ical": "ic",
        "ance": "",
        "ence": "",
        "ness": "",
        "able": "",
        "ible": "",
        "ment": "",
        "eli": "e",
        "bli": "ble",
        "ful": "",
        "ant": "",
        "ent": "",
        "ing": "",
        "ism": "",
        // "ate": "",
        "iti": "",
        "ous": "",
        "ive": "",
        "ize": "",
        "al": "",
        "ou": "",
        "er": "",
        "ic": ""
    };
    for (const [key, value] of Object.entries(stemmerTerms)) {
        term = term.replace(new RegExp(key + "$", "g"), value)
    }
    return term
}

export enum AlgorithmTypes {
  standard = 'standard',
  merge_and_split = 'merge_and_split',
  transposition = 'transposition'
}

export interface BuilderConstructionParams {
  terms: Index | string[];
  algorithm?: AlgorithmTypes;
  sort_candidates?: boolean;
  case_insensitive_sort?: boolean;
  include_distance?: boolean;
  maximum_candidates?: number;
}

export function constructTransducer({terms, algorithm = AlgorithmTypes.standard, sort_candidates = true, case_insensitive_sort = true, include_distance = true, maximum_candidates = 10}: BuilderConstructionParams) {
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
  transducer: Builder;
  index: Index;
}

interface BasicIndexParams {
  normalizeFunction?: CallableFunction,
  stopWords?: string[],
  stemmerFunction?: CallableFunction,
}

interface _IndexConstructionParams {
  entries: object[],
  entryIDIndex: string;
  keys: string[],
}

export interface IndexConstructionParams extends _IndexConstructionParams, BasicIndexParams {}

export class Index {
  normalizeFunction: CallableFunction;
  stemmerFunction: CallableFunction | undefined;
  stopWords: string[];
  data: IndexInterface = {};
  constructor({normalizeFunction = defaultNormalization, stopWords = [""], stemmerFunction} : BasicIndexParams ) {
    this.normalizeFunction = normalizeFunction;
    this.stemmerFunction = stemmerFunction;
    this.stopWords = stopWords;
  }

  load(indexData: IndexInterface) {
    this.data = indexData;
  }

  build({entries, entryIDIndex, keys, normalizeFunction = defaultNormalization, stopWords = [""], stemmerFunction}: IndexConstructionParams): IndexInterface {
    // Define the empty inverted index
    const INDEX: IndexInterface = {}
    // For each entry
    entries.forEach((entry) => {
        // For each key to index
        keys.forEach((key) => {
            // define terms by normalizing
            const entryValue = JSONPath({path: key, json: entry})[0]
            let terms: string[] = normalizeFunction(entryValue)
            // and splitting on whitespace.
            .split(/\s+/)
            // filter any stopwords.
            .filter((x: string) => stopWords.indexOf(x) === -1);
            // apply stemmer to terms if available
            if (stemmerFunction !== undefined) {
                terms = terms.map((term) => stemmerFunction(term))
            }
            // for each term
            terms.forEach((term, i) => {
                const entryValue = JSONPath({path: entryIDIndex, json: entry})[0]
                // If the term is in the index
                if (term in INDEX) {
                    // if posting is in inverted index
                    if (entryValue in INDEX[term]) {
                        INDEX[term][entryValue].push([key, i])
                    // else create the posting array
                    } else {
                        INDEX[term][entryValue] = [[key, i]]
                    }
                // else, add the term to the index
                } else {
                    INDEX[term] = {}
                    INDEX[term][entryValue] = [[key, i]]
                }
  
            })
        })
    })
    this.data = INDEX;
    return INDEX
  }
}

export class MTDSearch {
  index: Index;
  transducer: Builder;
 
  constructor({transducer, index}: MTDParams) {
    this.index = index;
    this.transducer = transducer;
  }

  search(query: string, maximum_edit_distance = 2) {
    // normalize
    query = this.index.normalizeFunction(query)
    // stem
    if (this.index.stemmerFunction !== undefined) {
      query = this.index.stemmerFunction(query)
    }
    return this.transducer.transduce(query, maximum_edit_distance)
  }
 
}