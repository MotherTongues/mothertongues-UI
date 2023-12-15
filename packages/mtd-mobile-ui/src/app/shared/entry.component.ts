import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DataService } from '../data.service';
import {
  DictionaryEntryExportFormat,
  Audio1,
  Optional,
} from '@mothertongues/search';

@Component({
  selector: 'mtd-entry',
  styleUrls: ['entry.component.scss'],
  templateUrl: 'entry.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EntryComponent implements OnInit, OnDestroy {
  @Input() entry!: DictionaryEntryExportFormat;
  optional = false;
  audio_playing: HTMLAudioElement[] = [];
  playing = false;
  constructor(public dataService: DataService) {
    // this.entry.
  }

  ngOnInit(): void {
    console.log(this.entry);
  }

  ngOnDestroy(): void {
    this.stopAllAudio();
  }

  checkOptional(optional: Optional | undefined) {
    if (optional) {
      return Object.values(optional).filter((x) => x).length > 0;
    } else {
      return false;
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
