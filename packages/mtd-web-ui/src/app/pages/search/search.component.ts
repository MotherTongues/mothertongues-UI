import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, tap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { DataService, EntryDict, ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';
import { DictionaryTitle } from '../../shared/entry-list/entry-list.component';

import { DictionaryEntryExportFormat, sortResults } from '@mothertongues/search';

@Component({
  selector: 'mtd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy {
  displayNav = true;
  entries$: BehaviorSubject<EntryDict>;
  matches$ = new BehaviorSubject<
    Array<DictionaryEntryExportFormat | DictionaryTitle>
  >([]);
  matchThreshold = 0;
  partialThreshold = 1;
  maybeThreshold = 3;
  approxWeight = 1;
  searchControl: FormControl;
  searchQuery = '';
  placeholder = 'Type a word here';
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  unsubscribe$ = new Subject<void>();
  onSearchKeyUp$ = new Subject<KeyboardEvent>();
  loading$ = new BehaviorSubject<boolean>(false);
  show?: string;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    this.entries$ = this.dataService.$entriesHash;
    this.searchControl = new FormControl();
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.show = params.show;
        this.ref.markForCheck();
      });
    this.onSearchKeyUp$
      .pipe(
        tap(() => this.loading$.next(true)),
        debounceTime(200)
      )
      .subscribe((event) => {
        const query = (event.target as HTMLInputElement).value;
        this.getResults(query);
        this.loading$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getResults(query: string): void {
    query = query.trim();
    if (query.length < 2) return;
    const l1_results = this.dataService.search_l1(query);
    const l2_results = this.dataService.search_l2(query);
    const results = l1_results.concat(l2_results);
    const matches = sortResults(
      results.filter((result) => result[0] < this.partialThreshold)
    ).map(m => this.entries$.value[m[1]]);
    const partMatches = sortResults(
      results.filter(
        (result) =>
          result[0] >= this.partialThreshold && result[0] < this.maybeThreshold
      )
    ).map(m => this.entries$.value[m[1]]);
    const maybeMatches = sortResults(
      results.filter((result) => result[0] >= this.maybeThreshold)
    ).map(m => this.entries$.value[m[1]]);
    const displayMatches: Array<DictionaryEntryExportFormat | DictionaryTitle> = [];
    if (matches.length) {
      displayMatches.unshift({ title: 'mtd.pages.search.matches' });
      displayMatches.unshift(...matches);
    }
    if (partMatches.length) {
      displayMatches.unshift({ title: 'mtd.pages.search.partial-matches' });
      displayMatches.unshift(...partMatches);
    }
    if (maybeMatches.length) {
      displayMatches.unshift({ title: 'mtd.pages.search.maybe-matches' });
      displayMatches.unshift(...maybeMatches);
    }
    this.matches$.next(displayMatches);
  }
}
