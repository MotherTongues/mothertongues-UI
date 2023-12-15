import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, map } from 'rxjs';
import {
  DictionaryEntryExportFormat,
  LanguageConfigurationExportFormat,
} from '@mothertongues/search';
import { DataService } from '../data.service';
@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  $config: BehaviorSubject<LanguageConfigurationExportFormat | null> =
    this.dataService.$config;
  $currentEntries = new BehaviorSubject<DictionaryEntryExportFormat[]>([]);
  $currentIndexStart: BehaviorSubject<number> = new BehaviorSubject(0);
  $manualTrigger = new BehaviorSubject(null);
  currentTen$: Observable<DictionaryEntryExportFormat[]> = combineLatest([
    this.$currentIndexStart,
    this.$currentEntries,
    this.$manualTrigger,
  ]).pipe(map(([start, entries, _]) => entries.slice(start, start + 10)));
  // Emit a combination of the start index and current entries any time either of them changes
  currentLetter$: Observable<string> = this.currentTen$.pipe(
    map((entries) => {
      if (entries && this.$config?.value?.alphabet) {
        const firstNonOOVIndex = entries[0].sorting_form.filter(
          (x) => x < 10000
        )[0];
        return this.$config.value?.alphabet[firstNonOOVIndex];
      } else {
        return '';
      }
    })
  );
  constructor(public dataService: DataService) {}
}
