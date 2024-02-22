import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DictionaryData } from '../../core/models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';
import { META } from '../../../config/config';
import {
  BookmarksService,
  MtdService,
  ROUTE_ANIMATIONS_ELEMENTS
} from '../../core/core.module';
@Component({
  selector: 'mtd-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseComponent implements OnDestroy {
  currentEntries$: BehaviorSubject<DictionaryData[]>;
  currentX: DictionaryData[];
  displayCategories$: Observable<any>;
  displayLetters$: Observable<any>;
  letters: string[];
  initialLetters: string[];
  selectedCategory = 'words';
  selectedLetter: number;
  startIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  numShown$: BehaviorSubject<number> = new BehaviorSubject(
    this.guessNumEntries()
  );

  letterSelectOptions: Object = { header: 'Select a Letter' };
  categorySelectOptions: Object = { header: 'Select a Category' };
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  unsubscribe$ = new Subject<void>();
  constructor(
    public bookmarkService: BookmarksService,
    private mtdService: MtdService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.displayCategories$ = this.mtdService.category_keys$;
    this.currentEntries$ = new BehaviorSubject<DictionaryData[]>(
      this.mtdService.dataDict_value
    );
    this.route.params.subscribe(params => {
      const start = parseInt(params.start ?? 0);
      const clamped = Math.max(
        0,
        Math.min(start, this.currentEntries$.getValue().length - 1)
      );
      if (start !== clamped)
        this.router.navigate([clamped], { relativeTo: this.route.parent });
      else this.startIndex$.next(clamped);
    });
    this.route.queryParams.subscribe(params => {
      if ('default_shown' in params)
        this.numShown$.next(parseInt(params.default_shown));
    });
    this.mtdService.dataDict$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(x => {
        this.currentEntries$.next(x);
        this.initializeEntries();
      });
    this.currentEntries$
      .pipe(
        map(entries =>
          this.getXFrom(
            this.startIndex$.getValue(),
            entries,
            this.numShown$.getValue()
          )
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(entries => (this.currentX = entries));
    this.startIndex$
      .pipe(
        map(i =>
          this.getXFrom(
            i,
            this.currentEntries$.getValue(),
            this.numShown$.getValue()
          )
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(entries => (this.currentX = entries));
    this.numShown$
      .pipe(
        map(x =>
          this.getXFrom(
            this.startIndex$.getValue(),
            this.currentEntries$.getValue(),
            x
          )
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(entries => (this.currentX = entries));
    this.initializeEntries();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  /**
   * Update the number of entries on resize.
   *
   * FIXME: Sure, we could use an Observable for this.
   */
  @HostListener('window:resize')
  handleResize() {
    this.numShown$.next(this.guessNumEntries());
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
    const is_mini = vw < 360; // NOTE: hard coded and arbitrary!
    const toolbar_height = is_phone ? 56 : 64; // Thanks, Google!
    const margin = is_phone ? 16 : 32;
    const guide_height = 18; // FIXME: should not actually take any space?
    // FIXME: Totally hard coded!
    const alphabet_height = is_mini ? 108 : is_phone ? 84 : 0;
    const border = 7;
    const height =
      vh - 2 * toolbar_height - 2 * margin - alphabet_height - guide_height;

    // FIXME: Really unsure where those extra 6 pixels come from.  Thanks, Google.
    return Math.max(2, Math.floor(is_phone ? height / 96 : height / 56));
  }

  getXFrom(i: number, entries: DictionaryData[], x: number): DictionaryData[] {
    return entries.slice(i, i + x);
  }

  initializeEntries() {
    // Add letter index to first words of that letter in entries
    this.letterInit();
  }

  letterNeverStarts(letter) {
    return this.displayLetters$.pipe(
      map(letters => letters.indexOf(letter) === -1)
    );
  }

  highlightLetter(letter) {
    return this.letters.indexOf(letter) === this.currentX[0].sorting_form[0];
  }

  // Determine whether letter occurs word-initially
  letterInit() {
    this.letters = this.mtdService.config_value.L1.lettersInLanguage;
    this.displayLetters$ = this.currentEntries$.pipe(
      map(entries => {
        const newLetters = [];
        for (const letter of this.letters) {
          const ind = this.letters.indexOf(letter);
          for (const entry of entries) {
            if (entry.sorting_form[0] === ind) {
              entry.firstWordIndex = ind;
              newLetters.push(letter);
              break;
            }
          }
        }
        return newLetters;
      })
    );
  }
  // Scroll to previous X entries
  prevX() {
    let current_val = this.startIndex$.value;
    const numShown = this.numShown$.value;
    if (current_val - numShown > 0) {
      this.router.navigate([(current_val -= numShown)], {
        relativeTo: this.route.parent
      });
    } else {
      this.router.navigate([0], { relativeTo: this.route.parent });
    }
  }

  // Scroll to next X entries
  nextX() {
    let current_val = this.startIndex$.value;
    const numShown = this.numShown$.value;
    if (current_val + numShown < this.currentEntries$.getValue().length) {
      this.router.navigate([current_val + numShown], {
        relativeTo: this.route.parent
      });
    } else {
      this.router.navigate(
        [Math.max(this.currentEntries$.getValue().length - numShown, 0)],
        { relativeTo: this.route.parent }
      );
    }
  }

  // Scroll to letter
  scrollTo(letter: string) {
    const letterIndex = this.letters.indexOf(letter);
    for (const entry of this.currentEntries$.getValue()) {
      if (entry.sorting_form[0] === letterIndex) {
        this.router.navigate([this.currentEntries$.getValue().indexOf(entry)], {
          relativeTo: this.route.parent
        });
        break;
      }
    }
  }

  selectCategory(category: string) {
    if (category === 'words') {
      this.mtdService.dataDict$
        .pipe(map(x => this.currentEntries$.next(x)))
        .subscribe()
        .unsubscribe();
    } else {
      this.mtdService.categories$
        .pipe(map(x => this.currentEntries$.next(x[category])))
        .subscribe()
        .unsubscribe();
    }
    this.selectedCategory = category;
    this.startIndex$.next(0);
    this.letterInit();
  }
}
