import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { LanguageConfigurationExportFormat } from '../../config/config';
import { BehaviorSubject, Subject } from 'rxjs';
import { DictionaryEntryExportFormat } from '../../config/entry';
import { BrowseService } from './browse.service';

@Component({
  selector: 'mtd-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.css'],
})
export class BrowsePage implements OnInit {
  $config: BehaviorSubject<LanguageConfigurationExportFormat | null> = this.dataService.$config;
  $dataHash: Subject<{ [id: string]: DictionaryEntryExportFormat }>;
  displayLetters: string[] = [];
  categories: string[] = [];
  letterNotFound = false;
  constructor(
    public dataService: DataService,
    public browseService: BrowseService
  ) {}

  ngOnInit() {
    this.$dataHash = this.dataService.$entriesHash;
    this.dataService.$categories.subscribe(
      (categories) => (this.categories = categories)
    );
    this.dataService.$categorizedEntries.subscribe((entries) => {
      if (entries['All'] !== undefined && entries['All'].length > 0) {
        this.browseService.$currentEntries.next(entries['All']);
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
    this.letterNotFound = false;
    const letterElement = letterEvent?.currentTarget as HTMLInputElement;
    let found = false;
    for (const entry of this.browseService.$currentEntries.value) {
      if (entry.word.startsWith(letterElement.value)) {
        this.browseService.$currentIndexStart.next(
          this.browseService.$currentEntries.value.indexOf(entry)
        );
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
    this.browseService.$currentEntries.next(
      this.dataService.$categorizedEntries.value[categoryElement.value]
    );
    this.browseService.$currentIndexStart.next(0);
  }

  goBack() {
    this.browseService.$currentIndexStart.next(
      Math.max(0, this.browseService.$currentIndexStart.value - 10)
    );
  }

  goForward() {
    this.browseService.$currentIndexStart.next(
      Math.min(
        this.browseService.$currentEntries.value.length - 10,
        this.browseService.$currentIndexStart.value + 10
      )
    );
  }
}
