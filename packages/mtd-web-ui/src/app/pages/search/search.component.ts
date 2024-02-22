import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  takeUntil,
  map,
  tap,
  distinctUntilChanged,
  debounceTime
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DictionaryData } from '../../core/models';
import { MtdService, ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';

import { slugify } from 'transliteration';

@Component({
  selector: 'mtd-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnDestroy, OnInit {
  displayNav = true;
  entries: DictionaryData[];
  entries$: Observable<DictionaryData[]>;
  matches$: BehaviorSubject<DictionaryData[]> = new BehaviorSubject([]);
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
      .subscribe(params => {
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
      .subscribe(entries => (this.entries = entries));
    this.onSearchKeyUp$
      .pipe(
        tap(event => this.loading$.next(true)),
        debounceTime(200)
      )
      .subscribe(event => {
        const value = (event.target as HTMLInputElement).value;
        this.getResults(value);
        this.loading$.next(false);
      });
  }

  getRegex(re, key = 'definition') {
    const results = [];
    for (const entry of this.entries) {
      if (re.test(entry[key])) {
        results.push(entry);
      }
    }
    const sorted_answers = results.sort(function(a, b) {
      return a[key].length - b[key].length;
    });
    return sorted_answers.slice(0, 9);
  }

  getRegexFromSlug(re, key = 'word') {
    const results = [];
    for (const entry of this.entries) {
      if (re.test(slugify(entry[key]))) {
        results.push(entry);
      }
    }
    const sorted_answers = results.sort(function(a, b) {
      return a[key].length - b[key].length;
    });
    return sorted_answers.slice(0, 9);
  }

  filterMatches(results) {
    return results.filter(r => r.distance <= this.matchThreshold);
  }
  filterPartMatches(results) {
    return results.filter(
      r =>
        r.distance <= this.partialThreshold && r.distance > this.matchThreshold
    );
  }
  filterMaybeMatches(results) {
    return results.filter(
      r => this.maybeThreshold && r.distance > this.partialThreshold
    );
  }

  getL2(searchQuery, entries): DictionaryData[] {
    const results = [];
    const re = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );
    for (const entry of entries) {
      if (re.test(entry.definition)) {
        results.push(entry);
      }
    }
    const sortedAnswers = results.sort((a, b) => {
      return a.definition.length - b.definition.length;
    });
    return sortedAnswers.slice(0, 9);
  }

  // Get l2_results (eng) and target (l1) results
  getResults(searchQuery: string): void {
    searchQuery = searchQuery.trim();
    if (searchQuery.length < 2) return;

    const searchQueryRe = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Normalize
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
    const target = window['searchL1'](originalSearchTerm);
    // Match containers
    let allMatches = [];
    const matches = [];
    const partMatches = [];
    const maybeMatches = [];

    // Collect l1Exact matches and add to allMatches
    const populateL1Exact = () => {
      for (const result of l1Exact) {
        const entry = Object.assign({}, result);
        entry.type = 'L1';
        entry.distance = this.matchThreshold;
        allMatches.push(entry);
      }
    };

    // Collect l2Exact matches and add to allMatches
    const populateL2Exact = () => {
      for (const result of l2Exact) {
        const entry = Object.assign({}, result);
        entry.type = 'L2';
        entry.distance = this.matchThreshold;
        allMatches.push(entry);
      }
    };

    // Collect l1Partial matches and add to allMatches
    const populateL1Partial = () => {
      for (const result of l1Partial.concat(l1PartialSlug)) {
        const entry = Object.assign({}, result);
        entry.type = 'L1';
        entry.distance = this.partialThreshold;
        allMatches.push(entry);
      }
    };

    // Collect l2Partial matches and add to allMatches
    const populateL2Partial = () => {
      for (const result of l2Partial) {
        const entry = Object.assign({}, result);
        entry.type = 'L2';
        entry.distance = this.partialThreshold;
        allMatches.push(entry);
      }
    };

    const populateTarget = () => {
      for (const result of target) {
        const entry = Object.assign({}, result);
        entry.type = 'L1';
        entry.distance += this.approxWeight;
        const resultIndex = allMatches.findIndex(
          match =>
            match.word === entry.word && match.definition === match.definition
        );
        if (resultIndex === -1) {
          allMatches.push(entry);
        } else {
          if (
            'distance' in allMatches[resultIndex] &&
            allMatches[resultIndex].distance > entry.distance
          ) {
            allMatches[resultIndex].distance = entry.distance;
          }
        }
      }
    };

    const mergeMatches = () => {
      for (const entry of allMatches) {
        if ('distance' in entry) {
          if (entry.distance === this.matchThreshold) {
            matches.push(entry);
          } else if (
            'distance' in entry &&
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
        } else {
          matches.push(entry);
        }
      }
      // Only these actually need to be sorted by distance
      maybeMatches.sort((a, b) => a.distance - b.distance);
    };
    populateL1Exact();
    populateL2Exact();
    populateL1Partial();
    populateL2Partial();
    populateTarget();
    allMatches = allMatches.filter(
      (match, index, self) =>
        self.findIndex(
          t => t.word === match.word && t.definition === match.definition
        ) === index
    );
    mergeMatches();
    // Add headers
    if (matches.length) {
      matches.unshift({ title: 'mtd.pages.search.matches' });
    }
    if (partMatches.length) {
      partMatches.unshift({ title: 'mtd.pages.search.partial-matches' });
    }
    if (maybeMatches.length) {
      maybeMatches.unshift({ title: 'mtd.pages.search.maybe-matches' });
    }
    this.matches$.next(matches.concat(partMatches).concat(maybeMatches));
  }
}
