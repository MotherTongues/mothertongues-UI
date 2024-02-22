import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Inject
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DictionaryData } from '../../core/models';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { BookmarksService, MtdService } from '../../core/core.module';
import { FileNotFoundDialogComponent } from '../file-not-found/file-not-found.component';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

interface ExampleAudio {
  speaker: string;
  filename: string;
  starts: Array<number>;
}

interface ExampleText {
  text: string;
  active: boolean;
}

interface Example {
  text: string;
  definition: Array<ExampleText>;
  audio: Array<ExampleAudio>;
}

@Component({
  selector: 'mtd-word-modal',
  templateUrl: './word-modal.component.html',
  styleUrls: ['./word-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordModalComponent implements OnInit, OnDestroy {
  checkedOptions: string[];
  displayImages = true; // default show images, turns to false on 404
  entry: DictionaryData;
  examples: Array<Example>;
  optional = false;
  optionalSelection: string[];
  objectKeys = Object.keys;
  image: string;
  reported = false;
  tabs = false;
  heightQuery: string;
  unsubscribe$ = new Subject<void>();

  constructor(
    public bookmarkService: BookmarksService,
    private mtdService: MtdService,
    public dialogRef: MatDialogRef<WordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this.checkedOptions = this.optionalSelection;

    this.entry = this.data.entry!;
    // Restructure the examples to Help With Stuff
    this.examples = [];
    if (this.entry.example_sentence) {
      for (const idx in this.entry.example_sentence) {
        const text = this.entry.example_sentence[idx];
        let definition;
        if (this.entry.example_sentence_definition)
          definition = this.entry.example_sentence_definition[idx]
            .split(/[\s.,:;()]+/)
            .filter(w => w.length)
            .map((w, i) => {
              return { text: w, active: false };
            });
        let audio;
        if (this.entry.example_sentence_audio)
          audio = this.entry.example_sentence_audio[idx];
        this.examples.push({
          text,
          definition,
          audio
        });
      }
    }
    // NOTE: This is really quite arbitrary
    const minHeight = 450 + 150 * this.examples.length;
    this.heightQuery = `(max-height: ${minHeight - 1}px)`;
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([this.heightQuery])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        const prevTabs = this.tabs;
        if (result.matches)
          this.tabs = !!(this.entry.audio && this.examples.length);
        else this.tabs = false;
        if (this.tabs != prevTabs) this.ref.markForCheck();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  getKey(obj) {
    return Object.keys(obj);
  }

  getVal(obj) {
    return Object.values(obj);
  }

  openReport() {
    if (this.reported) return;
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      data: this.data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reported = true;
        this.ref.markForCheck();
      }
    });
  }

  checkChecked(option) {
    if (this.checkedOptions.indexOf(option) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  hasAudio() {
    return this.mtdService.hasAudio(this.entry);
  }

  hasExample() {
    if (!('example_sentence' in this.entry)) return false;
    if (this.entry.example_sentence instanceof Array)
      return !!this.entry.example_sentence.length;
    return !!this.entry.example_sentence;
  }

  fileNotFound(path) {
    const dialogRef = this.dialog.open(FileNotFoundDialogComponent, {
      width: '250px',
      data: { path }
    });
  }

  playAudio(example, audio) {
    const path = this.mtdService.config_value.audio_path + audio.filename;
    const audiotag = new Audio(path);
    const starts = audio.starts.map(x => x * 0.01);

    audiotag.onerror = () => this.fileNotFound(path);
    // Only highlight if we have an alignment
    if (example && starts.length == example.definition.length - 1) {
      const definition = example.definition;
      let active = 0;
      audiotag.onplaying = () => {
        if (example === null) return;
        active = 0;
        example.definition[0].active = true;
        this.ref.markForCheck();
      };
      audiotag.ontimeupdate = event => {
        if (example === null) return;
        let idx;
        for (idx = 0; idx < starts.length; idx++) {
          example.definition[idx].active = false;
          if (audiotag.currentTime < starts[idx]) break;
        }
        if (idx != active) {
          example.definition[idx].active = true;
          active = idx;
          this.ref.markForCheck();
        }
      };
      audiotag.onended = () => {
        example.definition[active].active = false;
        this.ref.markForCheck();
      };
    }
    audiotag.play();
  }

  imageError() {
    this.displayImages = false;
  }

  toggleFav(entry) {
    this.bookmarkService.toggleBookmark(entry);
  }

  favourited(entry) {
    return this.bookmarkService.bookmarks.value.indexOf(entry) > -1;
  }
}
