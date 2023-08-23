import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { LanguageConfigurationExportFormat } from '../../config/config';
import {
  BehaviorSubject,
  combineLatest,
  map,
  tap,
  Observable,
  Subject,
  first,
} from 'rxjs';
import { DictionaryEntryExportFormat } from '../../config/entry';

@Component({
  selector: 'mtd-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.css'],
})
export class BrowsePage implements OnInit {
  $config: BehaviorSubject<LanguageConfigurationExportFormat | null>;
  $dataHash: Subject<{ [id: string]: DictionaryEntryExportFormat }>;
  displayLetters: string[] = [];
  $currentEntries = new BehaviorSubject<DictionaryEntryExportFormat[]>([]);
  $currentIndexStart: BehaviorSubject<number> = new BehaviorSubject(0);
  $manualTrigger = new BehaviorSubject(null);
  // Emit a combination of the start index and current entries any time either of them changes
  currentTen$: Observable<DictionaryEntryExportFormat[]> = combineLatest([
    this.$currentIndexStart,
    this.$currentEntries,
    this.$manualTrigger,
  ]).pipe(map(([start, entries, _]) => entries.slice(start, start + 10)));
  currentLetter$: Observable<string> = this.currentTen$.pipe(
    map((entries) => {
      if (entries && this.$config.value?.alphabet) {
        const firstNonOOVIndex = entries[0].sorting_form.filter(
          (x) => x < 10000
        )[0];
        return this.$config.value?.alphabet[firstNonOOVIndex];
      } else {
        return '';
      }
    })
  );

  categories: string[] = [];
  selectedLetter = '';
  letterNotFound = false;
  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.$config = this.dataService.$config;
    this.$dataHash = this.dataService.$entriesHash;
    this.dataService.$categorizedEntries.subscribe((entries) => {
      this.categories = Object.keys(entries);
      if (entries['All'] !== undefined && entries['All'].length > 0) {
        this.$currentEntries.next(entries['All']);
      }
    });
    this.currentLetter$.subscribe((letter) => (this.selectedLetter = letter));
    this.$config.subscribe((config) => {
      if (config) {
        if (Array.isArray(config.alphabet)) {
          this.displayLetters = config.alphabet;
        } else {
          this.displayLetters = [...config.alphabet];
        }
      }
    });
  }

  handleLetterChange(letterEvent: Event) {
    this.letterNotFound = false;
    const letterElement = letterEvent?.currentTarget as HTMLInputElement;
    let found = false;
    for (const entry of this.$currentEntries.value) {
      if (entry.word.startsWith(letterElement.value)) {
        this.$currentIndexStart.next(this.$currentEntries.value.indexOf(entry));
        found = true;
        break;
      }
    }
    if (!found) {
      this.letterNotFound = true;
    }
  }

  handleCategoryChange(categoryEvent: Event) {
    const categoryElement = categoryEvent?.currentTarget as HTMLInputElement;
    this.$currentEntries.next(
      this.dataService.$categorizedEntries.value[categoryElement.value]
    );
    this.$currentIndexStart.next(0);
  }

  goBack() {
    this.$currentIndexStart.next(
      Math.max(0, this.$currentIndexStart.value - 10)
    );
  }

  goForward() {
    this.$currentIndexStart.next(
      Math.min(
        this.$currentEntries.value.length - 10,
        this.$currentIndexStart.value + 10
      )
    );
  }
}
