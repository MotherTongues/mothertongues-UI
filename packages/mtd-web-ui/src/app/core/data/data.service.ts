import { Injectable } from '@angular/core';
import { constructSearchers, MTDSearch, Result } from '@mothertongues/search';
import {
  DictionaryEntryExportFormat,
  LanguageConfigurationExportFormat,
  MTDExportFormat,
} from '@mothertongues/search';
import { BehaviorSubject, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type EntryDict = {
  [key: string]: DictionaryEntryExportFormat;
};
export type CategoryDict = {
  [id: string]: DictionaryEntryExportFormat[];
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public l1_search: MTDSearch | null = null;
  public l1_compare_search: MTDSearch | null = null;
  public l2_search: MTDSearch | null = null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public $entriesHash: BehaviorSubject<EntryDict> = new BehaviorSubject({});
  public $entriesLength = new BehaviorSubject(0);
  public $loaded = new BehaviorSubject(false);
  public $config =
    new BehaviorSubject<LanguageConfigurationExportFormat | null>(null);
  public $sortedEntries = new BehaviorSubject<DictionaryEntryExportFormat[]>(
    []
  );
  public $categorizedEntries = new BehaviorSubject<CategoryDict>({});
  public $categories = new BehaviorSubject<string[]>([]);
  public $bookmarks = new BehaviorSubject<DictionaryEntryExportFormat[]>([]);
  constructor(private http: HttpClient) {
    this.http
      .get(environment.dataPath)
      .pipe(take(1))
      .subscribe((data: any) => {
        const mtdData: MTDExportFormat = data;
        // Load config
        const { config } = mtdData;
        this.$config.next(config);
        this.$entriesLength.next(mtdData.data.length);
        // Load entries into hash
        const entriesHash: EntryDict = {};
        mtdData.data.forEach((entry) => {
          entriesHash[entry.entryID] = entry;
        });
        this.$entriesHash.next(entriesHash);
        // Create Sorted Entries
        this.$sortedEntries.next(Object.values(mtdData.data));
        // Create Categorized Entries
        const categorizedEntries: {
          [id: string]: DictionaryEntryExportFormat[];
        } = { All: [] };
        const themes: string[] = [];
        const sources: string[] = [];
        this.$sortedEntries.value.forEach((entry) => {
          if (entry.theme && entry.theme !== 'null') {
            if (entry.theme in categorizedEntries) {
              categorizedEntries[entry.theme].push(entry);
            } else {
              categorizedEntries[entry.theme] = [entry];
              themes.push(entry.theme);
            }
          }
          if (entry.source) {
            if (entry.source in categorizedEntries) {
              categorizedEntries[entry.source].push(entry);
            } else {
              categorizedEntries[entry.source] = [entry];
              sources.push(entry.source);
            }
          }
          categorizedEntries['All'].push(entry);
        });
        sources.sort();
        themes.sort();
        this.$categories.next(['All'].concat(sources).concat(themes));
        this.$categorizedEntries.next(categorizedEntries);
        // Load Searchers
        [this.l1_search, this.l2_search] = constructSearchers(mtdData);
        this.$loaded.next(true);
      });
  }

  search_l1(query: string): Result[] {
    if (!this.l1_search)
      return [];
    return this.l1_search.search(query);
  }

  search_l2(query: string): Result[] {
    if (!this.l2_search)
      return [];
    return this.l2_search.search(query, 0);
  }
}
