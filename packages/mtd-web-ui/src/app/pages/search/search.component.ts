import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, tap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DictionaryData } from '../../core/models';
import { MtdService, ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';
import { DictionaryTitle } from '../../shared/entry-list/entry-list.component';

import { slugify } from 'transliteration';

@Component({
  selector: 'mtd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy, OnInit {
  displayNav = true;
  entries: DictionaryData[] = [];
  entries$: Observable<DictionaryData[]>;
  matches$ = new BehaviorSubject<Array<DictionaryData | DictionaryTitle>>([]);
  matchThreshold = 0;
  partialThreshold = 1;
  maybeThreshold = 3;
  approxWeight = 1;
  searchControl: FormControl;
  searchQuery = '';
  placeholder = 'Type a word here';
  language$: Observable<string>;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  unsubscribe$ = new Subject<void>();
  onSearchKeyUp$ = new Subject<KeyboardEvent>();
  loading$ = new BehaviorSubject<boolean>(false);
  show?: string;
  constructor(
    private mtdService: MtdService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    this.entries$ = this.mtdService.dataDict$;
    this.searchControl = new FormControl();
    this.language$ = this.mtdService.name$;
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.show = params.show;
        this.ref.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  ngOnInit(): void {
    this.entries$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((entries) => (this.entries = entries));
    this.onSearchKeyUp$
      .pipe(
        tap(() => this.loading$.next(true)),
        debounceTime(200)
      )
      .subscribe((event) => {
        const value = (event.target as HTMLInputElement).value;
        this.getResults(value);
        this.loading$.next(false);
      });
  }

  getRegex(re: RegExp, key = 'definition') {
    const results = [];
    for (const entry of this.entries) {
      // FIXME: All these methods are very suspect
      // @ts-ignore
      if (re.test(entry[key])) {
        results.push(entry);
      }
    }
    const sorted_answers = results.sort(function (a, b) {
      // @ts-ignore
      return a[key].length - b[key].length;
    });
    return sorted_answers.slice(0, 9);
  }

  getRegexFromSlug(re: RegExp, key = 'word') {
    const results = [];
    for (const entry of this.entries) {
      // @ts-ignore
      if (re.test(slugify(entry[key]))) {
        results.push(entry);
      }
    }
    const sorted_answers = results.sort(function (a, b) {
      // @ts-ignore
      return a[key].length - b[key].length;
    });
    return sorted_answers.slice(0, 9);
  }

  // Get l2_results (eng) and target (l1) results
  getResults(searchQuery: string): void {
    searchQuery = searchQuery.trim();
    if (searchQuery.length < 2) return;

    const searchQueryRe = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Normalize
    // @ts-ignore
    const mtd = window['mtd'];
    const originalSearchTerm = mtd.convertQuery(searchQuery);
    // 1. Exact match
    const searchQueryRegex = new RegExp(
      `(\\s|^){1}${searchQueryRe}(?=([;.?!\\s]|$))`,
      'i'
    );
    const l1Exact = this.getRegex(searchQueryRegex, 'word');
    const l2Exact = this.getRegex(searchQueryRegex);
    // 2. Partial match
    const searchQueryPartialRegex = new RegExp(
      `(\\s|^){1}(${searchQueryRe})\\S|\\S(${searchQueryRe})(\\s|^){1}|\\S(${searchQueryRe})\\S`,
      'i'
    );
    const l1Partial = this.getRegex(searchQueryPartialRegex, 'word');
    const l2Partial = this.getRegex(searchQueryPartialRegex);
    // 3. Partial match on slugified form
    const l1PartialSlug = this.getRegexFromSlug(
      new RegExp(
        searchQueryPartialRegex.source + '|' + searchQueryRegex.source,
        'i'
      )
    );
    // 4. levenstein (includes compare form and display)
    // @ts-ignore
    const target = window['searchL1'](originalSearchTerm);
    // Match containers
    let allMatches: Array<DictionaryData> = [];
    const matches: Array<DictionaryData> = [];
    const partMatches: Array<DictionaryData> = [];
    const maybeMatches: Array<DictionaryData> = [];

    // Collect l1Exact matches and add to allMatches
    const populateL1Exact = () => {
      for (const result of l1Exact) {
        const entry = Object.assign({}, result);
        entry.distance = this.matchThreshold;
        allMatches.push(entry);
      }
    };

    // Collect l2Exact matches and add to allMatches
    const populateL2Exact = () => {
      for (const result of l2Exact) {
        const entry = Object.assign({}, result);
        entry.distance = this.matchThreshold;
        allMatches.push(entry);
      }
    };

    // Collect l1Partial matches and add to allMatches
    const populateL1Partial = () => {
      for (const result of l1Partial.concat(l1PartialSlug)) {
        const entry = Object.assign({}, result);
        entry.distance = this.partialThreshold;
        allMatches.push(entry);
      }
    };

    // Collect l2Partial matches and add to allMatches
    const populateL2Partial = () => {
      for (const result of l2Partial) {
        const entry = Object.assign({}, result);
        entry.distance = this.partialThreshold;
        allMatches.push(entry);
      }
    };

    const populateTarget = () => {
      for (const result of target) {
        const entry = Object.assign({}, result);
        entry.distance += this.approxWeight;
        const resultIndex = allMatches.findIndex(
          (match) =>
            match.word === entry.word && match.definition === match.definition
        );
        if (resultIndex === -1) {
          allMatches.push(entry);
          continue;
        }
        const matchedEntry = allMatches[resultIndex];
        if (
          matchedEntry.distance !== undefined &&
          matchedEntry.distance > entry.distance
        )
          matchedEntry.distance = entry.distance;
      }
    };

    const mergeMatches = () => {
      for (const entry of allMatches) {
        if (entry.distance === undefined) {
          matches.push(entry);
          continue;
        } else if (entry.distance === this.matchThreshold) {
          matches.push(entry);
        } else if (
          entry.distance <= this.partialThreshold &&
          entry.distance > this.matchThreshold
        ) {
          partMatches.push(entry);
        } else if (
          entry.distance <= this.maybeThreshold &&
          entry.distance > this.partialThreshold
        ) {
          maybeMatches.push(entry);
        }
      }
      // Only these actually need to be sorted by distance
      maybeMatches.sort((a, b) => {
        // FIXME: Really need to enforce that distance exists
        if (a.distance !== undefined && b.distance !== undefined)
          return a.distance - b.distance
        return 0;
      });
    };
    populateL1Exact();
    populateL2Exact();
    populateL1Partial();
    populateL2Partial();
    populateTarget();
    allMatches = allMatches.filter(
      (match, index, self) =>
        self.findIndex(
          (t) => t.word === match.word && t.definition === match.definition
        ) === index
    );
    mergeMatches();
    // Add headers
    const displayMatches: Array<DictionaryData | DictionaryTitle> = [];
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
