import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { DataService } from '../data.service';
import {
  DictionaryEntryExportFormat,
  Audio1,
  Optional,
} from '@mothertongues/search';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';
import { BookmarksService } from './bookmarks.service';

@Component({
    selector: 'mtd-entry',
    styleUrls: ['entry.component.scss'],
    templateUrl: 'entry.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EntryComponent implements OnInit, OnDestroy {
  @Input() entry!: DictionaryEntryExportFormat;
  audio_playing: HTMLAudioElement[] = [];
  playing = false;
  constructor(
    public dataService: DataService,
    public settingsService: SettingsService,
    public bookmarksService: BookmarksService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopAllAudio();
  }

  isBookmarked() {
    return this.bookmarksService.isBookmarked(this.entry);
  }

  toggleBookmark() {
    this.bookmarksService.toggleBookmark(this.entry);
  }

  changeOptional() {
    this.settingsService.showOptionalInfo$.next(!this.settingsService.showOptionalInfo$.value)
  }

  checkOptional(optional: Optional | undefined) {
    if (optional) {
      return Object.values(optional).filter((x) => x).length > 0;
    } else {
      return false;
    }
  }

  originalOrder = (): number => {
    return 0;
  }

  checkListIsNotEmpty(anyList: any[]) {
    return anyList.filter(e=>e).length > 0
  }

  optionalInfo(optional: Optional | undefined) {
    if (optional) {
      return new Map(
        Object.entries(optional).filter(([_, v]) => v.toString().length),
      );
    } else {
      return {};
    }
  }

  stopAllAudio() {
    this.audio_playing.forEach((element) => {
      element.pause();
    });
    this.audio_playing = [];
  }

  playAudio(audio: Audio1) {
    this.stopAllAudio();
    const audioElement = new Audio(audio.filename);
    audioElement.onerror = (err) => {
      console.log(err);
      this.audio_playing.pop();
    };
    audioElement.onended = () => {
      this.audio_playing.pop();
      this.playing = false;
    };
    audioElement.onpause = () => {
      this.playing = false;
    };
    audioElement.onplay = () => {
      this.playing = true;
    };
    this.audio_playing.push(audioElement);
    audioElement.play();
  }
}
