import { Injectable } from '@angular/core';
import {
  constructTransducer,
  DistanceCalculator,
  Index,
  MTDSearch,
  Result,
} from '@mothertongues/search';
import { DictionaryEntry } from '../config/entry'
import { ExportLanguageConfiguration, MTDExportFormat, SearchAlgorithms } from '../config/mtd'
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
  public $entriesHash: BehaviorSubject<{ [id: string]: DictionaryEntry }> =
    new BehaviorSubject({});
  public $entriesLength = new BehaviorSubject(0);
  public $loaded = new BehaviorSubject(false);
  public $config: BehaviorSubject<ExportLanguageConfiguration> = new BehaviorSubject({});
  public $sortedEntries = new BehaviorSubject<DictionaryEntry[]>([]);
  public $categorizedEntries = new BehaviorSubject<{ [id: string]: DictionaryEntry[] }>({})
  constructor(private http: HttpClient) {
    this.http
      .get('../assets/dictionary_data.json')
      .pipe(take(1))
      .subscribe((data: any) => {
        const mtdData: MTDExportFormat = data;
        // Load config
        const {config} = mtdData;
        this.$config.next(config);
        console.log(this.$config.value);
        // Load entries into hash
        this.$entriesHash.next(mtdData.data);
        this.$entriesLength.next(Object.keys(mtdData.data).length);
        // Create Sorted Entries
        this.$sortedEntries.next([...Object.values(mtdData.data)].sort((a: DictionaryEntry, b: DictionaryEntry) => a.word.localeCompare(b.word)))
        // Create Categorized Entries
        const categorizedEntries: { [id: string]: DictionaryEntry[] } = {'All': []}
        this.$sortedEntries.value.forEach((entry) => {
          if (entry.theme) {
            if (entry.theme in categorizedEntries && entry.entryID) {
              categorizedEntries[entry.theme].push(entry)
            } else if (entry.entryID) {
              categorizedEntries[entry.theme] = [entry]
            }
          }
          if (entry.entryID) {
            categorizedEntries['All'].push(entry)
          }
        })
        this.$categorizedEntries.next(categorizedEntries)
        // Load L1 index
        const l1_index = new Index({
          normalizeFunctionConfig: config['l1_normalization_transducer'],
          stemmerFunctionChoice: config['l1_stemmer'],
          data: mtdData.l1_index,
        });
        const l1_transducer = this.returnTransducer(
          config['l1_search_strategy'] ?? 'liblevenstein_automata',
          l1_index,
          config['l1_search_config']
        );
        this.l1_search = new MTDSearch({
          transducer: l1_transducer,
          index: l1_index,
          searchType: config['l1_search_strategy'] ?? 'liblevenstein_automata',
          tokens: config['alphabet'],
        });
        // Load L2 index
        const l2_index = new Index({
          normalizeFunctionConfig: config['l2_normalization_transducer'],
          stemmerFunctionChoice: config['l2_stemmer'],
          data: mtdData.l2_index,
        });
        const l2_transducer = this.returnTransducer(
          config['l2_search_strategy'] ?? 'liblevenstein_automata',
          l2_index,
          config['l2_search_config']
        );
        this.l2_search = new MTDSearch({
          transducer: l2_transducer,
          index: l2_index,
          searchType: config['l2_search_strategy'] ?? 'liblevenstein_automata',
          tokens: config['alphabet'],
        });
        this.$loaded.next(true);
      });
  }

  returnTransducer(searchType: SearchAlgorithms, index: Index, config: any) {
    let transducer = null;
    if (searchType === "liblevenstein_automata") {
      transducer = constructTransducer({ terms: index });
    } else if (searchType === "weighted_levenstein") {
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
