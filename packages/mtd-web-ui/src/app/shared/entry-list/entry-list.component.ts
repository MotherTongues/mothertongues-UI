import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WordModalComponent } from '../word-modal/word-modal.component';
import { PronunciationGuideComponent } from '../pronunciation-guide/pronunciation-guide.component';
import { DictionaryData, ExampleAudio } from '../../core/models';
import { BookmarksService, MtdService } from '../../core/core.module';

import { MatDialog } from '@angular/material/dialog';

import { FileNotFoundDialogComponent } from '../file-not-found/file-not-found.component';

export interface DictionaryTitle {
  title: string;
}

@Component({
  selector: 'mtd-entry-list',
  templateUrl: 'entry-list.component.html',
  styleUrls: ['entry-list.component.scss']
})
export class EntryListComponent implements OnChanges, OnInit, OnDestroy {
  pageName: string;
  edit = false;
  unsubscribe$ = new Subject<void>();

  @Input() parentEdit: boolean;
  @Input() entries: Array<DictionaryData | DictionaryTitle>;
  @Input() searchTerm: string;
  @Input() threshold: number;
  @Input() showEntry: number;
  @Input() shouldHighlight = false;
  @Input() searchResults: boolean = false;
  @Input() floatingGuide: boolean = false;
  constructor(
    private bookmarkService: BookmarksService,
    public dialog: MatDialog,
    private mtdService: MtdService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        if (!('show' in params)) return;
        // Look first in the (small) list of entries if it exists, but check the full
        // one too so that permalinks always work (as long as there's an entry list...!)
        const entry =
          this.entries?.find(entry => "entryID" in entry && entry.entryID == params.show) ??
          this.mtdService.dataDict_value.find(
            entry => entry.entryID == params.show
          );
        if (entry === undefined) return; // FIXME: Perhaps should show an error of some sort
        const dialogRef = this.dialog.open(WordModalComponent, {
          panelClass: 'mtd-word-dialog',
          data: entry
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(_ => {
            this.router.navigate(['.'], { relativeTo: this.route });
          });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  showModal(entry: DictionaryData) {
    this.router.navigate(['.'], {
      queryParams: { show: entry.entryID },
      relativeTo: this.route
    });
  }

  openPronunciation() {
    this.dialog.open(PronunciationGuideComponent);
  }

  playDefaultAudio(entry: DictionaryData) {
    let audioPrefix = '';
    if ('audio_path' in this.mtdService.config_value) {
      audioPrefix = this.mtdService.config_value.audio_path;
    }
    const defaultAudio =
      audioPrefix +
          entry.audio.filter((audioFile: ExampleAudio) => audioFile.filename)[0].filename;
    const audio = new Audio(defaultAudio);
    audio.onerror = () => this.fileNotFound(defaultAudio);
    audio.play();
  }

  fileNotFound(path: string) {
    this.dialog.open(FileNotFoundDialogComponent, {
      width: '250px',
      data: path
    });
  }

  hasAudio(entry: DictionaryData) {
    return this.mtdService.hasAudio(entry);
  }

  highlight(entry: DictionaryData, langType: 'L1' | 'L2'): string {
    let text;
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

  toggleBookmark(entry: DictionaryData) {
    this.bookmarkService.toggleBookmark(entry);
  }

  ngOnChanges() {
    this.edit = this.parentEdit;
  }

  /**
   * Narrow things from the list so we know if we cannot treat them as entries.
   */
  isTitle(entry: DictionaryData | DictionaryTitle): entry is DictionaryTitle {
    return "title" in entry;
  }

  /**
   * Narrow things from the list so we know if we can treat them as entries.
   */
  isEntry(entry: DictionaryData | DictionaryTitle): entry is DictionaryData {
    return !("title" in entry);
  }
}
