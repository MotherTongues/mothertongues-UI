import { Injectable } from '@angular/core';
import {
  constructTransducer,
  defaultNormalization,
  Index,
  MTDSearch,
  Result,
} from '@mothertongues/search';
import { Entry } from '../config/entries';
import { BehaviorSubject, take, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

function customNormalization(query: string): string {
  // Remove accents in French default
  return defaultNormalization(query)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public l1_search: MTDSearch;
  public l1_compare_search: MTDSearch;
  public l2_search: MTDSearch;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public $entriesHash: BehaviorSubject<{ [id: string]: Entry }> =
    new BehaviorSubject({});
  public $entriesLength = new BehaviorSubject(0);
  l1_loaded = new BehaviorSubject(false);
  l2_loaded = new BehaviorSubject(false);
  l1_compare_loaded = new BehaviorSubject(false);
  hash_loaded = new BehaviorSubject(false);
  // $loaded = 
  constructor(private http: HttpClient) {
    this.http
      .get('../assets/entries_hash.json')
      .pipe(take(1))
      .subscribe((data: any) => {
        const _entriesHash: { [id: string]: Entry } = data;
        this.$entriesHash.next(_entriesHash);
        this.$entriesLength.next(Object.keys(data).length);
        this.hash_loaded.next(true);
      });
    // Build L1 index, transducer, and search objects.
    const l1_index = new Index({ normalizeFunction: customNormalization });
    this.loadIndexAndCreateTransducer$('../assets/l1_index.json', l1_index).subscribe((index_transducer) => {
      const index = index_transducer[0]
      const transducer = index_transducer[1]
      this.l1_search = new MTDSearch({
        transducer: transducer,
        index: index,
      });
      this.l1_loaded.next(true);
    }
    )

    // Build L1 compare index, transducer, and search objects
    const l1_compare_index = new Index({
      normalizeFunction: customNormalization,
    });
    this.loadIndexAndCreateTransducer$('../assets/l1_compare_index.json', l1_compare_index).subscribe((index_transducer) => {
      const index = index_transducer[0]
      const transducer = index_transducer[1]
      this.l1_compare_search = new MTDSearch({
        transducer: transducer,
        index: index,
      });
      this.l1_compare_loaded.next(true);
    }
    )
    // Build L2 index, transducer, and search objects
    const l2_index = new Index({});
    this.loadIndexAndCreateTransducer$('../assets/l2_index.json', l2_index).subscribe((index_transducer) => {
      const index = index_transducer[0]
      const transducer = index_transducer[1]
      this.l2_search = new MTDSearch({
        transducer: transducer,
        index: index,
      });
      this.l2_loaded.next(true);
    }
    )
  }

  loadIndexAndCreateTransducer$(url: string, index: Index) {
    return this.http
    .get(url)
    .pipe(take(1),
    map((data) => {
      const t0 = Date.now();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      index.load(data);
      const transducer = constructTransducer({ terms: index });
      const t1 = Date.now();
      console.log(
        `Loading indices and building search objects for ${
          this.$entriesLength.value
        } entries took ${(t1 - t0) / 1000} seconds.`
      );
      return [index, transducer]
    }))
  }

  search_l1(query: string): Result[] {
    return this.l1_search
      .search(query)
      .concat(this.l1_compare_search.search(query));
  }

  search_l2(query: string): Result[] {
    return this.l2_search.search(query, 1);
  }
}
