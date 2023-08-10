import { Injectable } from '@angular/core';
import {
  constructTransducer,
  DistanceCalculator,
  Index,
  MTDSearch,
  Result,
  SearchTypes
} from '@mothertongues/search';
import { Entry } from '../config/entries';
import { BehaviorSubject, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// function customNormalization(query: string): string {
//   // Remove accents in French default
//   return defaultNormalization(query)
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '');
// }

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public l1_search: MTDSearch;
  public l1_compare_search: MTDSearch;
  public l2_search: MTDSearch;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public $entriesHash: BehaviorSubject<{ [id: string]: Entry }> =
    new BehaviorSubject({});
  public $entriesLength = new BehaviorSubject(0);
  public $loaded = new BehaviorSubject(false);
  public $config: BehaviorSubject<object> = new BehaviorSubject({})
  constructor(private http: HttpClient) {
    this.http
      .get('../assets/dictionary_data.json')
      .pipe(take(1))
      .subscribe((data: any) => {
        // Load config
        const config = data.config
        this.$config.next(config)
        console.log(this.$config.value)
        // Load entries into hash
        this.$entriesHash.next(data.data);
        this.$entriesLength.next(Object.keys(data.data).length);
        console.log(this.$entriesLength.value)
        // Load L1 index
        const l1_index = new Index({normalizeFunctionConfig: config['l1_normalization_transducer'], stemmerFunctionChoice: config['l1_stemmer'], data: data.l1_index})
        this.l1_search = new MTDSearch({
          transducer: new DistanceCalculator(),
          index: l1_index,
          searchType: SearchTypes.weighted_levenstein
        });
        // Load L2 index
        const l2_index = new Index({normalizeFunctionConfig: config['l2_normalization_transducer'], stemmerFunctionChoice: config['l2_stemmer'], data: data.l2_index})
        // TODO: move decision between weighted lev search and MAFSA to MTD config
        this.l2_search = new MTDSearch({
              transducer: constructTransducer({ terms: l2_index }),
              index: l2_index,
              searchType: SearchTypes.liblevenstein_automata
            });
        this.$loaded.next(true);
      });
  }

  search_l1(query: string): Result[] {
    return this.l1_search
      .search(query)
  }

  search_l2(query: string): Result[] {
    return this.l2_search.search(query, 0);
  }
}
