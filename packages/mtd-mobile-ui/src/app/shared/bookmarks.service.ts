import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, take } from 'rxjs';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
import { DataService } from '../data.service';

/**
 * Stores bookmarked entry IDs in localStorage, using the same key format as
 * mtd-web-ui so both apps read and write bookmarks the same way.
 */
@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  $bookmarks = new BehaviorSubject<DictionaryEntryExportFormat[]>([]);

  constructor(private dataService: DataService) {
    // Bookmarks are stored as entry IDs, so wait until both the config (for the
    // storage key) and the entries (to resolve the IDs) have loaded.
    this.dataService.$loaded
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.loadBookmarks());
  }

  localStorageKey(): string | null {
    const config = this.dataService.$config.value;
    if (config === null) return null;
    return `mtd-bookmarks-${config.L1}-${config.L2}-${config.build}`;
  }

  loadBookmarks() {
    const key = this.localStorageKey();
    if (key === null) return;
    let ids: string[] = [];
    try {
      const item = localStorage.getItem(key);
      if (item !== null) ids = JSON.parse(item);
    } catch (err) {
      console.warn(`Could not load bookmarks from ${key}`, err);
      return;
    }
    const entries = this.dataService.$entriesHash.value;
    this.$bookmarks.next(
      ids.map((id) => entries[id]).filter((entry) => entry !== undefined),
    );
  }

  setBookmarks(bookmarks: DictionaryEntryExportFormat[]) {
    // Always emit a new array so that subscribers (and ngOnChanges) see the change
    this.$bookmarks.next([...bookmarks]);
    const key = this.localStorageKey();
    if (key === null) return;
    try {
      localStorage.setItem(
        key,
        JSON.stringify(bookmarks.map((entry) => entry.entryID)),
      );
    } catch (err) {
      console.warn(`Could not save bookmarks to ${key}`, err);
    }
  }

  isBookmarked(entry: DictionaryEntryExportFormat): boolean {
    return this.$bookmarks.value.some((b) => b.entryID === entry.entryID);
  }

  toggleBookmark(entry: DictionaryEntryExportFormat) {
    if (this.isBookmarked(entry)) {
      this.setBookmarks(
        this.$bookmarks.value.filter((b) => b.entryID !== entry.entryID),
      );
    } else {
      this.setBookmarks(this.$bookmarks.value.concat([entry]));
    }
  }

  removeBookmarks(entryIDs: Set<string>) {
    this.setBookmarks(
      this.$bookmarks.value.filter((b) => !entryIDs.has(b.entryID)),
    );
  }
}
