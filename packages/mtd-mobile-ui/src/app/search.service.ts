import { Injectable } from '@angular/core';
import { constructTransducer, defaultNormalization, Index, MTDSearch, englishStemmer, Result } from "@mothertongues/search";
import { ENTRIES, entryIDKey, L1_keys, L2_keys } from '../config/entries';

function customNormalization(query: string): string {
  // Remove accents in French default
  return defaultNormalization(query).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

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
    const t0 = Date.now();
    const l1_index = new Index({normalizeFunction: customNormalization});
    l1_index.build({entries: ENTRIES, normalizeFunction: customNormalization, entryIDIndex:entryIDKey, keys:L1_keys});
    const l1_transducer = constructTransducer({"terms":l1_index});
    this.l1_search = new MTDSearch({transducer: l1_transducer, index: l1_index});
    // Build L1 compare index, transducer, and search objects
    const l1_compare_index = new Index({normalizeFunction: customNormalization});
    l1_compare_index.build({entries: ENTRIES, normalizeFunction: customNormalization, entryIDIndex:entryIDKey, keys:L1_keys})
    const l1_compare_transducer = constructTransducer({"terms":l1_compare_index});
    this.l1_compare_search = new MTDSearch({transducer: l1_compare_transducer, index: l1_compare_index})
    // Build L2 index, transducer, and search objects
    const l2_index = new Index({});
    l2_index.build({entries: ENTRIES, entryIDIndex:entryIDKey, keys:L2_keys, stemmerFunction: englishStemmer })
    const l2_transducer = constructTransducer({"terms": l2_index})
    this.l2_search = new MTDSearch({transducer: l2_transducer, index: l2_index})
    const t1 = Date.now();
    console.log(`Building indices and search objects for ${ENTRIES.length} entries took ${(t1-t0)/1000} seconds.`)
  }

  search_l1(query: string): Result[] {
    return this.l1_search.search(query).concat(this.l1_compare_search.search(query));
  }

  search_l2(query: string):  Result[] {
    return this.l2_search.search(query, 1);
  }

}