import { Injectable } from '@angular/core';
import { Location, constructTransducer, Index, MTDSearch, englishStemmer } from "@mothertongues/search";
import { ENTRIES, ENTRIES_HASH, Entry, entryIDKey, L1_keys, L2_keys } from './entries';


export type Result = [distance: number,  entry: Entry, location: Location[]]

@Injectable({
  providedIn: 'root',
})
export class SearchService {
    public l1_search: MTDSearch;
    public l1_compare_search: MTDSearch;
    public l2_search : MTDSearch;
  constructor() {
    // Build L1 index, transducer, and search objects.
    // TODO: load instead of build if the index was already built.
    const l1_index = new Index({});
    l1_index.build({entries: ENTRIES, entryIDIndex:entryIDKey, keys:L1_keys});
    const l1_transducer = constructTransducer({"terms":l1_index});
    this.l1_search = new MTDSearch({transducer: l1_transducer, index: l1_index});
    // Build L1 compare index, transducer, and search objects
    const l1_compare_index = new Index({});
    l1_compare_index.build({entries: ENTRIES, entryIDIndex:entryIDKey, keys:L1_keys})
    const l1_compare_transducer = constructTransducer({"terms":l1_compare_index});
    this.l1_compare_search = new MTDSearch({transducer: l1_compare_transducer, index: l1_compare_index})
    // Build L2 index, transducer, and search objects
    const l2_index = new Index({});
    l2_index.build({entries: ENTRIES, entryIDIndex:entryIDKey, keys:L2_keys, stemmerFunction: englishStemmer })
    const l2_transducer = constructTransducer({"terms": l2_index})
    this.l2_search = new MTDSearch({transducer: l2_transducer, index: l2_index})
  }

  convertTermsToSearchResponse(transducerResults: [term: string, distance: number][], searchObject: MTDSearch) : [distance: number, entry: Entry, location: [key: string, index: number][]][] {
    const results:  Result[] = []
      transducerResults.forEach((result: [term: string, distance: number]) => {
        const term = result[0];
        const distance = result[1]
        Object.keys(searchObject.index.data[term]).forEach((posting) => {
            results.push([distance, ENTRIES_HASH[posting], searchObject.index.data[term][posting]])
        })
    })
    return results
  }

  search_l1(query: string): Result[] {
    const results = this.l1_search.search(query).concat(this.l1_compare_search.search(query));
    return this.convertTermsToSearchResponse(results, this.l1_search)
  }

  search_l2(query: string):  Result[] {
    const results = this.l2_search.search(query, 1);
    return this.convertTermsToSearchResponse(results, this.l2_search)
  }

}