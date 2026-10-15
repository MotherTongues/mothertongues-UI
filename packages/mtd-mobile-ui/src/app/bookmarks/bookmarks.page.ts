import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
import { BookmarksService } from '../shared/bookmarks.service';

@Component({
    selector: 'mtd-bookmarks',
    templateUrl: './bookmarks.page.html',
    styleUrls: ['./bookmarks.page.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BookmarksPage implements OnInit {
  $bookmarks: BehaviorSubject<DictionaryEntryExportFormat[]>;
  edit = false;
  selected = new Set<string>();
  constructor(public bookmarksService: BookmarksService) {}

  ngOnInit() {
    this.$bookmarks = this.bookmarksService.$bookmarks;
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.selected = new Set();
  }

  onSelectionChange(selected: Set<string>) {
    this.selected = selected;
  }

  removeEntries() {
    this.bookmarksService.removeBookmarks(this.selected);
    this.selected = new Set();
    this.edit = false;
  }
}
