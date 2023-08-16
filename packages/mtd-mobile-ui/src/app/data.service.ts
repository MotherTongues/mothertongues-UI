import { Injectable } from '@angular/core';
import {
  constructTransducer,
  DistanceCalculator,
  Index,
  MTDSearch,
  Result,
  SearchTypes,
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
  public $config: BehaviorSubject<object> = new BehaviorSubject({});
  constructor(private http: HttpClient) {
    this.http
      .get('../assets/dictionary_data.json')
      .pipe(take(1))
      .subscribe((data: any) => {
        // Load config
        const config = data.config;
        this.$config.next(config);
        console.log(this.$config.value);
        // Load entries into hash
        this.$entriesHash.next(data.data);
        this.$entriesLength.next(Object.keys(data.data).length);
        console.log(this.$entriesHash.value);
        // Load L1 index
        const l1_index = new Index({
          normalizeFunctionConfig: config['l1_normalization_transducer'],
          stemmerFunctionChoice: config['l1_stemmer'],
          data: data.l1_index,
        });
        const l1_transducer = this.returnTransducer(
          config['l1_search_strategy'],
          l1_index,
          config['l1_search_config']
        );
        this.l1_search = new MTDSearch({
          transducer: l1_transducer,
          index: l1_index,
          searchType: config['l1_search_strategy'],
          tokens: config['alphabet'],
        });
        // Load L2 index
        const l2_index = new Index({
          normalizeFunctionConfig: config['l2_normalization_transducer'],
          stemmerFunctionChoice: config['l2_stemmer'],
          data: data.l2_index,
        });
        const l2_transducer = this.returnTransducer(
          config['l2_search_strategy'],
          l2_index,
          config['l2_search_config']
        );
        this.l2_search = new MTDSearch({
          transducer: l2_transducer,
          index: l2_index,
          searchType: config['l2_search_strategy'],
          tokens: config['alphabet'],
        });
        this.$loaded.next(true);
      });
  }

  returnTransducer(searchType: SearchTypes, index: Index, config: any) {
    let transducer = null;
    if (searchType === SearchTypes.liblevenstein_automata) {
      transducer = constructTransducer({ terms: index });
    } else if (searchType === SearchTypes.weighted_levenstein) {
      if (config) {
        transducer = new DistanceCalculator(config);
      } else {
        transducer = new DistanceCalculator({});
      }
    }
    return transducer;
  }

  search_l1(query: string): Result[] {
    return this.l1_search.search(query);
  }

  search_l2(query: string): Result[] {
    return this.l2_search.search(query, 0);
  }
}
