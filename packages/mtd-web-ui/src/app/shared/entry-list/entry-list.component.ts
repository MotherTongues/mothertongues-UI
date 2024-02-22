import {
  Component,
  Input,
  Inject,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChange
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WordModalComponent } from '../word-modal/word-modal.component';
import { PronunciationGuideComponent } from '../pronunciation-guide/pronunciation-guide.component';
import { DictionaryData } from '../../core/models';
import { BookmarksService, MtdService } from '../../core/core.module';

import { MatDialog } from '@angular/material/dialog';

import { FileNotFoundDialogComponent } from '../file-not-found/file-not-found.component';
import { slugify } from 'transliteration';

const levenstein = function(string1, string2) {
  const a = string1,
    b = string2 + '',
    m = [],
    min = Math.min;
  let i, j;

  if (!(a && b)) return (b || a).length;

  for (i = 0; i <= b.length; m[i] = [i++]);
  for (j = 0; j <= a.length; m[0][j] = j++);

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      m[i][j] =
        b.charAt(i - 1) === a.charAt(j - 1)
          ? m[i - 1][j - 1]
          : (m[i][j] = min(
              m[i - 1][j - 1] + 1,
              min(m[i][j - 1] + 1, m[i - 1][j] + 1)
            ));
    }
  }

  return m[b.length][a.length];
};

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
  @Input() entries: DictionaryData[];
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
          this.entries?.find(entry => entry.entryID == params.show) ??
          this.mtdService.dataDict_value.find(
            entry => entry.entryID == params.show
          );
        if (entry === undefined) return; // FIXME: Perhaps should show an error of some sort
        const dialogRef = this.dialog.open(WordModalComponent, {
          panelClass: 'mtd-word-dialog',
          data: { entry }
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(result => {
            this.router.navigate(['.'], { relativeTo: this.route });
          });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  showModal(entry) {
    this.router.navigate(['.'], {
      queryParams: { show: entry.entryID },
      relativeTo: this.route
    });
  }

  openPronunciation() {
    this.dialog.open(PronunciationGuideComponent);
  }

  playDefaultAudio(entry) {
    let audioPrefix = '';
    if ('audio_path' in this.mtdService.config_value) {
      audioPrefix = this.mtdService.config_value.audio_path;
    }
    const defaultAudio =
      audioPrefix +
      entry.audio.filter(audioFile => audioFile.filename)[0].filename;
    const audio = new Audio(defaultAudio);
    audio.onerror = () => this.fileNotFound(defaultAudio);
    audio.play();
  }

  fileNotFound(path) {
    const dialogRef = this.dialog.open(FileNotFoundDialogComponent, {
      width: '250px',
      data: { path }
    });
  }

  hasAudio(entry) {
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

  toggleBookmark(entry) {
    this.bookmarkService.toggleBookmark(entry);
  }

  ngOnChanges() {
    this.edit = this.parentEdit;
  }
}
