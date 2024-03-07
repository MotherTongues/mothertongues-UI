import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WordModalComponent } from '../word-modal/word-modal.component';
import { Audio1, DictionaryEntryExportFormat } from '@mothertongues/search';
import { DataService } from '../../core/data.service';
import { BookmarksService } from '../../core/bookmarks.service';

import { MatDialog } from '@angular/material/dialog';

import { FileNotFoundDialogComponent } from '../file-not-found/file-not-found.component';

export interface DictionaryTitle {
  title: string;
}

@Component({
  selector: 'mtd-entry-list',
  templateUrl: 'entry-list.component.html',
  styleUrls: ['entry-list.component.scss'],
})
export class EntryListComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  // Have to allow null here because of #@!$@# async pipe
  @Input() entries: Array<
    DictionaryEntryExportFormat | DictionaryTitle
  > | null = [];
  @Input() searchTerm: string = '';
  @Input() threshold: number = 0;
  constructor(
    private bookmarkService: BookmarksService,
    public dialog: MatDialog,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        if (!('show' in params)) return;
        // Look first in the (small) list of entries if it exists, but check the full
        // one too so that permalinks always work (as long as there's an entry list...!)
        const entry =
          this.entries?.find(
            (entry) => 'entryID' in entry && entry.entryID == params.show
          ) ?? this.dataService.$entriesHash.value[params.show];
        if (entry === undefined) return; // FIXME: Perhaps should show an error of some sort
        const dialogRef = this.dialog.open(WordModalComponent, {
          panelClass: 'mtd-word-dialog',
          data: entry,
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((_) => {
            this.router.navigate(['.'], { relativeTo: this.route });
          });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  showModal(entry: DictionaryEntryExportFormat) {
    this.router.navigate(['.'], {
      queryParams: { show: entry.entryID },
      relativeTo: this.route,
    });
  }

  playDefaultAudio(entry: DictionaryEntryExportFormat) {
    const defaultAudio = entry.audio?.filter(
      (audioFile: Audio1) => audioFile.filename
    )[0].filename;
    if (!defaultAudio) return;
    const audio = new Audio(defaultAudio);
    audio.onerror = () => this.fileNotFound(defaultAudio);
    audio.play();
  }

  fileNotFound(path: string) {
    this.dialog.open(FileNotFoundDialogComponent, {
      width: '250px',
      data: path,
    });
  }

  highlight(entry: DictionaryEntryExportFormat, langType: 'L1' | 'L2') {
    let text = '';
    if (langType === 'L1') {
      text = entry.word;
    } else if (langType === 'L2') {
      text = entry.definition;
    }
    if (!this.searchTerm) return text;
    if (!text) return text;
    return text.replace(
      new RegExp(this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      '<span class="langMatched">$&</span>'
    );
  }

  toggleBookmark(entry: DictionaryEntryExportFormat) {
    this.bookmarkService.toggleBookmark(entry);
  }

  /**
   * Narrow things from the list so we know if we cannot treat them as entries.
   */
  isTitle(
    entry: DictionaryEntryExportFormat | DictionaryTitle
  ): entry is DictionaryTitle {
    return 'title' in entry;
  }

  /**
   * Narrow things from the list so we know if we can treat them as entries.
   */
  isEntry(
    entry: DictionaryEntryExportFormat | DictionaryTitle
  ): entry is DictionaryEntryExportFormat {
    return !('title' in entry);
  }
}
