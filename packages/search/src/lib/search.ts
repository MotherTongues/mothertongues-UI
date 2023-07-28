// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Builder } from "liblevenshtein"; 
import { JSONPath } from 'jsonpath-plus';

export type Location = [
    entryIndex: string,
    positionIndex: number
]

export interface Posting {[entryID: string]: {location: Location[], score: number}}

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
  priorityKeys: string[]
}

class Counter {
  counter: {[key: string]: number} = {};
  constructor(array: string[]) {
    this.update(array);
  }
  add = (val: string) => {
      this.counter[val] = (this.counter[val] || 0) + 1;
  };
  update = (array: string[]) => {
      array.forEach((val) => this.add(val));
  };
}

export interface IndexConstructionParams extends _IndexConstructionParams, BasicIndexParams {calculateScore?: boolean, delta?: number}

function indexBuilderHelper(index: IndexInterface, key: string, entryValue: string, normalizeFunction: CallableFunction, stemmerFunction: CallableFunction | undefined, stopWords: string[], calculateScore: boolean, docFrequencyCounter: Counter, docTermsCounter: {[key: string]: number}, entryIDIndex: string, entry: object, priorityKeys: string[]) {
  let terms: string[] = normalizeFunction(entryValue)
  // and splitting on whitespace.
  .split(/\s+/)
  // filter any stopwords.
  .filter((x: string) => stopWords.indexOf(x) === -1);
  // apply stemmer to terms if available
  if (stemmerFunction !== undefined) {
      terms = terms.map((term) => stemmerFunction(term))
  }
  // if calculating TF-IDF, add terms to counter
  if (calculateScore) {
    docFrequencyCounter.update([...new Set(terms)])
  }
  // for each term
  terms.forEach((term, i) => {
      const docID = JSONPath({path: entryIDIndex, json: entry})[0]
      if (calculateScore && priorityKeys.indexOf(key) > -1) {
        if (docID in docTermsCounter) {
          docTermsCounter[docID] += 1;
        } else {
          docTermsCounter[docID] = 1
        }
        
      }
      // If the term is in the index
      if (term in index) {
          // if posting is in inverted index
          if (docID in index[term]) {
              index[term][docID].location.push([key, i])
          // else create the posting array
          } else {
              // initialize with 0 score
              index[term][docID] = {location: [[key, i]], score: 0};
          }
      // else, add the term to the index
      } else {
          index[term] = {}
          // initialize with 0 score
          index[term][docID] = {location: [[key, i]], score: 0};
      }
    
  })
}

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

  build({entries, entryIDIndex, keys, normalizeFunction = defaultNormalization, stopWords = [""], stemmerFunction, calculateScore = true, delta = 0, priorityKeys = ["word", "definition"]}: IndexConstructionParams): IndexInterface {
    // Define the empty inverted index
    const INDEX: IndexInterface = {}
    // if calculating TF-IDF, create a counter to keep track of document frequency
    if (calculateScore) {
      // sourcery skip: avoid-using-var
      // eslint-disable-next-line no-var
      var docFrequencyCounter: Counter = new Counter([]);
      // eslint-disable-next-line no-var
      var docTermsCounter: {[key: string]: number} = {};
    }
    // For each entry
    entries.forEach((entry) => {
        // For each key to index
        keys.forEach((key) => {
            const entryValue = JSONPath({path: key, json: entry})[0]
            if (Array.isArray(entryValue)) {
              entryValue.forEach((item, i) => {
                indexBuilderHelper(INDEX, `${key}[${i}]`, item, normalizeFunction, stemmerFunction, stopWords, calculateScore, docFrequencyCounter, docTermsCounter, entryIDIndex, entry, priorityKeys)
              })
            } else {
              indexBuilderHelper(INDEX, key, entryValue, normalizeFunction, stemmerFunction, stopWords, calculateScore, docFrequencyCounter, docTermsCounter, entryIDIndex, entry,  priorityKeys)
            }
        })
    })
    // calculate TF-IDF scaled by length of document log((TF * (N/DF)) / NTD) where TF is the frequency of the term T,
    // N is the number of documents, DF is the number of times the term T occurs in document D and NTD is the number of terms in document D in priority keys
    // This prioritizes documents with the highest concentration of rare search terms
    // Also adds a bit of weight to priority keys ('word' and 'definition' by default)
    if (calculateScore) {
      // Get the number of documents
      const n_documents = entries.length;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // const _sumLengths = Object.values(docTermsCounter).reduce((a,b) => a+b, 0)
      // const averagePriorityKeyLength = (_sumLengths / n_documents) || 0
      // For each term in the index
      Object.entries(INDEX).forEach((term) => {
        // For each posting associated with the term
        Object.keys(term[1]).forEach((docID) => {
          // Get the frequency of the current term in the current posting across all keys
          const termFrequency = term[1][docID].location.length;
          // Get the frequency of the term across all documents
          const documentFrequency = docFrequencyCounter.counter[term[0]]
          const nPriorityTermsInDoc = docTermsCounter[docID]
          // Get the frequency of the current term in the current posting across priority keys
          const priorityTermFrequency = (term[1][docID].location.filter((location) => priorityKeys.indexOf(location[0]) > -1).length)
          const IDF = 1+n_documents/1+documentFrequency
          // const TFIDF = Math.log(1  + (termFrequency * IDF))
          // Calculate log TFIDF scaled using a term frequency scaled by the number of priority terms in the document + the frequency of the priority term.
          // This should prioritize entries with short word/definitions which should align with user intuitions
          // allows for optional delta value to allow for different scaling between indices
          term[1][docID].score = Math.log((termFrequency/nPriorityTermsInDoc) * IDF) + priorityTermFrequency + delta
        })
      })
    }
    this.data = INDEX;
    return INDEX
  }
}

export type Result = [distance: number, docID: string, location: Location[], score: number]

export class MTDSearch {
  index: Index;
  transducer: Builder;
 
  constructor({transducer, index}: MTDParams) {
    this.index = index;
    this.transducer = transducer;
  }

  search(query: string, maximum_edit_distance = 2, sort=false) {
    const splitQueryTerms = query.split(/\s+/)
    const matchSets: {[key: string]: Set<string>} = {}
    const results: [string,number][][] = splitQueryTerms.map((word) => {
      // normalize
      word = this.index.normalizeFunction(word)
      // stem
      if (this.index.stemmerFunction !== undefined) {
        word = this.index.stemmerFunction(word)
      }
      return this.transducer.transduce(word, maximum_edit_distance)
    })
    // create sets of document ids for each query term for multi-word queries
    results.forEach((word, i) => {
      matchSets[splitQueryTerms[i]] = new Set(word.map((x) => Object.keys(this.index.data[x[0]])).flat());
    })
    const flatResults = results.flat()
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
          resultsObject[posting][2] += this.index.data[term][posting].score
        } else {
          resultsObject[posting] = [distance, this.index.data[term][posting].location, this.index.data[term][posting].score]
        }
    })
    
    }
    // TODO: this is messy, too many changes to the shapes of things, needs refactoring.
    const resultsArray: Result[] = Object.keys(resultsObject).map((posting) => [resultsObject[posting][0]/splitQueryTerms.length, posting, resultsObject[posting][1], resultsObject[posting][2]]);
    if (sort) {
      return resultsArray.sort((a, b) => b[3] - a[3])
    } else {
      return resultsArray
    }
    
  }
 
}