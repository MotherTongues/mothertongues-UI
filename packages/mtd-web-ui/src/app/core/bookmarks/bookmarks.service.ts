import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MtdService } from '../mtd/mtd.service';
import { Config, DictionaryData } from '../models';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  public bookmarks = new BehaviorSubject<DictionaryData[]>([]);
  entries: DictionaryData[] = []
  config: Config;
  constructor(private mtdService: MtdService) {
    this.config = this.mtdService.config_value;
    this.mtdService.dataDict$.subscribe(entries => {
      this.entries = entries;
      this.loadBookmarks();
    });
  }

  loadBookmarks() {
    const item = localStorage.getItem(this.config.L1.name + this.config.build);
    if (item !== null) {
      const vals = JSON.parse(item);
      for (let i = 0; i < vals.length; i++) {
        const entry = this.entries.find(x => x['entryID'] === vals[i]);
        if (entry === undefined)
          continue;
        const index = this.bookmarks.value.indexOf(entry);
        if (index === -1) {
          entry.favourited = true;
          this.bookmarks.next(this.bookmarks.value.concat([entry]));
        }
      }
    }
  }

  setBookmarks(val: DictionaryData[]) {
    this.bookmarks.next(val);
    const vals = val.map(x => x.entryID);
    localStorage.setItem(
      this.config.L1.name + this.config.build,
      JSON.stringify(vals)
    );
  }

  toggleBookmark(entry: DictionaryData) {
    const i = this.bookmarks.value.indexOf(entry);
    // FIXME: if it's not there...? this code is suspect
    let bookmarks;
    if (i > -1) {
      bookmarks = this.bookmarks.value;
      bookmarks.splice(i, 1);
    } else if (i < 0) {
      bookmarks = this.bookmarks.value.concat([entry]);
    }
    if (bookmarks)
      this.setBookmarks(bookmarks);
  }
}
