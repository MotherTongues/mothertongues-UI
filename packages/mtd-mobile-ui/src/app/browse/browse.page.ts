import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { LanguageConfigurationExportFormat } from '../../config/config';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
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
  // Emit a combination of the start index and current entries any time either of them changes
  currentTen$: Observable<DictionaryEntryExportFormat[]> = combineLatest([
    this.$currentIndexStart,
    this.$currentEntries,
  ]).pipe(map(([start, entries]) => entries.slice(start, start + 10)));
  categories: string[] = [];
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
    const letterElement = letterEvent?.currentTarget as HTMLInputElement;
    for (const entry of this.$currentEntries.value) {
      if (entry.word.startsWith(letterElement.value)) {
        this.$currentIndexStart.next(this.$currentEntries.value.indexOf(entry));
        break;
      }
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
