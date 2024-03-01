import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DictionaryData } from '../../core/models';
import { DataService, ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';

@Component({
  selector: 'mtd-random',
  templateUrl: './random.component.html',
  styleUrls: [
    './random.component.scss',
    '../../shared/layout/single/single.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomComponent {
  displayNav = true;
  entries$ = new Subject<DictionaryData[]>();
  unsubscribe$ = new Subject<void>();
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  show?: string;
  nRandom = this.guessNumEntries();
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.show = params.show;
        this.ref.markForCheck();
      });
  }

  @HostListener('window:resize')
  handleResize() {
    const newCount = this.guessNumEntries();
    if (newCount != this.nRandom) {
      // No real reason to use an Observable here, right?
      this.nRandom = newCount;
      this.ref.markForCheck();
    }
  }

  /**
   * Guess a reasonable number of entries based on the viewport size.
   *
   * This can't be exact because the entries may expand for long definitions.
   */
  guessNumEntries(): number {
    /* FIXME: for now, we use the viewport size and not the size of
       the content__text element - this is not very readable and has
       to match the defitions in `styles-variables.scss` and
       `single.component.scss`! */
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const is_phone = vw < 600; // NOTE: not specific to phones!
    const toolbar_height = is_phone ? 56 : 64; // Thanks, Google!
    const margin = is_phone ? 16 : 32;
    const header_height = is_phone ? 32 : 48;
    const padding = is_phone ? 10 : 15;
    const guide_height = 18; // NOTE: just a guess!
    const height =
      vh -
      toolbar_height -
      2 * margin -
      header_height -
      2 * padding -
      guide_height;

    // FIXME: Really unsure where those extra 6 pixels come from.  Thanks, Google.
    return Math.max(2, Math.floor(is_phone ? height / 96 : height / 56));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  getRandom() {
    // FIXME: Not actually guaranteed to exist yet...
    const entries = this.dataService.$sortedEntries.value;
    const r = Array(this.nRandom).fill(0).map(_ => {
      const idx = Math.floor(Math.random() * entries.length);
      const ent = entries[idx];
      return {
          word: ent.word,
          definition: ent.definition,
          entryID: ent.entryID,
          sorting_form: ent.sorting_form,
          compare_form: ent.word,
          example_sentence: ent.example_sentence,
          example_sentence_audio: [],
          example_sentence_definition_audio: [],
      };
    });
    this.entries$.next(r);
  }
}
