import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DataService } from '../../core/data.service';
import { BookmarksService } from '../../core/bookmarks.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/route.animations';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
@Component({
  selector: 'mtd-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseComponent implements OnDestroy {
  // Full list of entries (could be a single category)
  currentEntries$: BehaviorSubject<DictionaryEntryExportFormat[]>;
  // Entries currently on display
  currentX: DictionaryEntryExportFormat[] = [];

  displayLetters: string[] = [];
  letters: string[] = [];
  selectedCategory = 'words';
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
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentEntries$ = new BehaviorSubject<DictionaryEntryExportFormat[]>(
      this.dataService.$sortedEntries.value
    );
    this.route.params.subscribe((params) => {
      const start = parseInt(params.start ?? 0);
      const clamped = Math.max(
        0,
        Math.min(start, this.dataService.$entriesLength.value - 1)
      );
      if (start !== clamped) {
        this.router.navigate(['..', clamped], { relativeTo: this.route });
      } else this.startIndex$.next(clamped);
    });
    this.route.queryParams.subscribe((params) => {
      if ('default_shown' in params)
        this.numShown$.next(parseInt(params.default_shown));
    });

    // Take entries from full sorted list by default
    this.dataService.$sortedEntries
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((x) => this.currentEntries$.next(x));

    // Update display when set of entries changes
    this.currentEntries$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((entries) => {
          this.letterInit(entries);
          return this.getXFrom(
            this.startIndex$.value,
            entries,
            this.numShown$.value
          );
        })
      )
      .subscribe((entries) => this.updateEntries(entries));

    // Update display when indices change
    this.startIndex$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((i) =>
          this.getXFrom(i, this.currentEntries$.value, this.numShown$.value)
        )
      )
      .subscribe((entries) => this.updateEntries(entries));
    this.numShown$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((x) =>
          this.getXFrom(this.startIndex$.value, this.currentEntries$.value, x)
        )
      )
      .subscribe((entries) => this.updateEntries(entries));
  }

  updateEntries(entries: DictionaryEntryExportFormat[]) {
    // Change detection takes care of this
    this.currentX = entries;
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
    const height =
      vh - 2 * toolbar_height - 2 * margin - alphabet_height - guide_height;

    // FIXME: Really unsure where those extra 6 pixels come from.  Thanks, Google.
    return Math.max(2, Math.floor(is_phone ? height / 96 : height / 56));
  }

  getXFrom(
    i: number,
    entries: DictionaryEntryExportFormat[],
    x: number
  ): DictionaryEntryExportFormat[] {
    return entries.slice(i, i + x);
  }

  highlightLetter(letter: string) {
    return this.letters.indexOf(letter) === this.currentX[0].sorting_form[0];
  }

  // Update the list of initial letters
  letterInit(entries: DictionaryEntryExportFormat[]) {
    const config = this.dataService.$config.value;
    if (config === null) return;
    this.letters = config.alphabet;
    this.displayLetters = [];
    // FIXME: Rewrite this to be O(N) not O(N^2)
    for (const letter of this.letters) {
      const ind = this.letters.indexOf(letter);
      for (const entry of entries) {
        if (entry.sorting_form[0] === ind) {
          entry.firstWordIndex = ind;
          this.displayLetters.push(letter);
          break;
        }
      }
    }
  }
  // Scroll to previous X entries
  prevX() {
    let current_val = this.startIndex$.value;
    const numShown = this.numShown$.value;
    const prevStart = current_val - numShown;
    if (prevStart > 0) {
      this.router.navigate(['..', prevStart], { relativeTo: this.route });
    } else {
      this.router.navigate(['..', '0'], { relativeTo: this.route });
    }
  }

  // Scroll to next X entries
  nextX() {
    let current_val = this.startIndex$.value;
    const numShown = this.numShown$.value;
    const nextStart = current_val + numShown;
    if (nextStart < this.currentEntries$.value.length) {
      this.router.navigate(['..', nextStart], { relativeTo: this.route });
    } else {
      const maxStart = Math.max(
        this.currentEntries$.value.length - numShown,
        0
      );
      this.router.navigate(['..', maxStart], { relativeTo: this.route });
    }
  }

  // Scroll to letter
  scrollTo(letter: string) {
    const letterIndex = this.letters.indexOf(letter);
    for (const entry of this.currentEntries$.value) {
      if (entry.sorting_form[0] === letterIndex) {
        this.router.navigate(
          ['..', this.currentEntries$.value.indexOf(entry)],
          {
            relativeTo: this.route,
          }
        );
        break;
      }
    }
  }

  selectCategory(category: string) {
    this.currentEntries$.next(
      this.dataService.$categorizedEntries.value[category]
    );
    this.selectedCategory = category;
    this.startIndex$.next(0);
  }

  getShowingIndices() {
    const current_val = this.startIndex$.value;
    return {
      startIndex: current_val + 1,
      endIndex: current_val + this.currentX.length,
      length: this.currentEntries$.value.length,
    };
  }
}
