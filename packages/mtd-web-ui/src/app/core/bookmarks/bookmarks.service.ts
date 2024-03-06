import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  DictionaryEntryExportFormat,
  LanguageConfigurationExportFormat,
} from '@mothertongues/search';
import { DataService, EntryDict } from '../core.module';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  public bookmarks = new BehaviorSubject<DictionaryEntryExportFormat[]>([]);
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
    return `${this.config.L1}-${this.config.L2}-${this.config.build}`;
  }

  loadBookmarks() {
    // FIXME: Use LocalStorageService, duh!
    const key = this.localStorageKey();
    if (key === null) return;
    const item = localStorage.getItem(key);
    if (item !== null) {
      const vals = JSON.parse(item);
      for (let i = 0; i < vals.length; i++) {
        const entry = this.entries[vals[i]];
        if (entry === undefined) continue;
        const index = this.bookmarks.value.indexOf(entry);
        if (index === -1) {
          entry.favourited = true;
          this.bookmarks.next(this.bookmarks.value.concat([entry]));
        }
      }
    }
  }

  setBookmarks(val: DictionaryEntryExportFormat[]) {
    // FIXME: Use LocalStorageService, duh!
    const key = this.localStorageKey();
    if (key === null) return;
    this.bookmarks.next(val);
    const vals = val.map((x) => x.entryID);
    localStorage.setItem(key, JSON.stringify(vals));
  }

  toggleBookmark(entry: DictionaryEntryExportFormat) {
    const i = this.bookmarks.value.indexOf(entry);
    let bookmarks;
    if (i == -1) {
      // Add if not present
      bookmarks = this.bookmarks.value.concat([entry]);
    }
    else {
      bookmarks = this.bookmarks.value;
      bookmarks.splice(i, 1);
    }
    // Update bookmarks
    this.setBookmarks(bookmarks);
  }
}
