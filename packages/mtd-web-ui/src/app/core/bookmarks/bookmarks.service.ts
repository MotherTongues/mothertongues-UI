import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  DictionaryEntryExportFormat,
  LanguageConfigurationExportFormat,
} from '@mothertongues/search';
import { DataService, EntryDict } from '../core.module';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  public $bookmarks = new BehaviorSubject<DictionaryEntryExportFormat[]>([]);
  entries: EntryDict = {};
  config: LanguageConfigurationExportFormat | null = null;
  constructor(private dataService: DataService) {
    this.dataService.$config.subscribe((config) => {
      this.config = config;
      this.loadBookmarks();
    });
    this.dataService.$entriesHash.subscribe((entries) => {
      this.entries = entries;
      this.loadBookmarks();
    });
  }

  localStorageKey(): string | null {
    if (this.config === null) return null;
    return `mtd-bookmarks-${this.config.L1}-${this.config.L2}-${this.config.build}`;
  }

  loadBookmarks() {
    const key = this.localStorageKey();
    if (key === null) {
      console.log("Not loading bookmarks, config not initialized");
      return;
    }
    const item = localStorage.getItem(key);
    if (item !== null) {
      console.log(`Loaded bookmarks from ${key}`);
      const vals = JSON.parse(item);
      for (let i = 0; i < vals.length; i++) {
        const entry = this.entries[vals[i]];
        if (entry === undefined) continue;
        const index = this.$bookmarks.value.indexOf(entry);
        if (index === -1) {
          entry.favourited = true;
          this.$bookmarks.next(this.$bookmarks.value.concat([entry]));
        }
      }
    }
  }

  setBookmarks(val: DictionaryEntryExportFormat[]) {
    const key = this.localStorageKey();
    if (key === null) {
      console.log("Not saving bookmarks, config not initialized");
      return;
    }
    this.$bookmarks.next(val);
    const vals = val.map((x) => x.entryID);
    localStorage.setItem(key, JSON.stringify(vals));
    console.log(`Saved bookmarks to ${key}`);
  }

  isBookmarked(entry: DictionaryEntryExportFormat): boolean {
    return (this.$bookmarks.value.indexOf(entry) != -1);
  }

  toggleBookmark(entry: DictionaryEntryExportFormat) {
    const i = this.$bookmarks.value.indexOf(entry);
    let bookmarks;
    if (i == -1) {
      // Add if not present
      bookmarks = this.$bookmarks.value.concat([entry]);
    }
    else {
      bookmarks = this.$bookmarks.value;
      bookmarks.splice(i, 1);
    }
    // Update bookmarks
    this.setBookmarks(bookmarks);
  }
}
