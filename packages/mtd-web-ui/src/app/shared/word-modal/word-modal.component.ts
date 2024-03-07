import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BookmarksService, DataService } from '../../core/core.module';
import { FileNotFoundDialogComponent } from '../file-not-found/file-not-found.component';
import { DictionaryEntryExportFormat } from '@mothertongues/search';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordModalComponent implements OnInit, OnDestroy {
  examples: Array<Example>;
  optional = false;
  tabs = false;
  heightQuery: string;
  unsubscribe$ = new Subject<void>();

  constructor(
    public bookmarkService: BookmarksService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<WordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public entry: DictionaryEntryExportFormat,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    // Restructure the examples to Help With Stuff
    this.examples = [];
    if (this.entry.example_sentence) {
      for (const idx in this.entry.example_sentence) {
        const text = this.entry.example_sentence[idx];
        let definition: Array<ExampleText> = [];
        if (this.entry.example_sentence_definition)
          definition = this.entry.example_sentence_definition[idx]
            .split(/[\s.,:;()]+/)
            .filter((w: string) => w.length)
            .map((w: string) => {
              return { text: w, active: false };
            });
        let audio: Array<ExampleAudio> = [];
        if (this.entry.example_sentence_definition_audio)
          audio = this.entry.example_sentence_definition_audio[idx].map(
            (a) => ({
              filename: a.filename,
              speaker: a.description ?? "unknown",
              // FIXME: add starts to model
              starts: [],
            })
          );
        this.examples.push({
          text,
          definition,
          audio,
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
      .subscribe((result) => {
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

  getKey(obj: object) {
    return Object.keys(obj);
  }

  getVal(obj: object) {
    return Object.values(obj);
  }

  hasExample() {
    if (!('example_sentence' in this.entry)) return false;
    if (this.entry.example_sentence instanceof Array)
      return !!this.entry.example_sentence.length;
    return !!this.entry.example_sentence;
  }

  fileNotFound(path: string) {
    this.dialog.open(FileNotFoundDialogComponent, {
      width: '250px',
      data: path,
    });
  }

  playAudio(example: Example | null, audio: ExampleAudio) {
    const path = this.dataService.$config.value?.audio_path + audio.filename;
    const audiotag = new Audio(path);
    const starts = audio.starts.map((x) => x * 0.01);

    audiotag.onerror = () => this.fileNotFound(path);
    // Only highlight if we have an alignment
    if (example && starts.length == example.definition.length - 1) {
      let active = 0;
      audiotag.onplaying = () => {
        if (example === null) return;
        active = 0;
        example.definition[0].active = true;
        this.ref.markForCheck();
      };
      audiotag.ontimeupdate = () => {
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

  toggleFav(entry: DictionaryEntryExportFormat) {
    this.bookmarkService.toggleBookmark(entry);
  }

  favourited(entry: DictionaryEntryExportFormat) {
    return this.bookmarkService.isBookmarked(entry);
  }
}
