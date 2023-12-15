import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { BehaviorSubject } from 'rxjs';
import { DictionaryEntryExportFormat } from '@mothertongues/search';

@Component({
  selector: 'mtd-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.css'],
})
export class BookmarksPage implements OnInit {
  $bookmarks: BehaviorSubject<DictionaryEntryExportFormat[]>;
  edit = false;
  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.$bookmarks = this.dataService.$bookmarks;
  }

  removeEntries() {}
}
