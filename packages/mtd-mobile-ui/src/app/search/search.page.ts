import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { sortResults } from '@mothertongues/search';
import { BehaviorSubject } from 'rxjs';
import { SearchService } from './search.service';

@Component({
  selector: 'mtd-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  partialThreshold = 1;
  maybeThreshold = 2;
  $loaded: BehaviorSubject<boolean>;
  constructor(
    public dataService: DataService,
    public searchService: SearchService
  ) {
    this.$loaded = this.dataService.$loaded;
  }

  ngOnInit(): void {}

  search(ev: Event) {
    if (ev.target === null) {
      return;
    }
    const query = (ev.target as HTMLTextAreaElement).value;
    this.searchService.searchQuery = query;
    if (query.length > 1) {
      let t0 = Date.now();
      // TODO: should be a better way to join results, this could have duplicates
      const l1_results = this.dataService.search_l1(query);
      let t1 = Date.now();
      console.log(
        `Performed L1 search of ${
          this.dataService.$entriesLength.value
        } entries in ${(t1 - t0).toString()} ms`
      );
      t0 = Date.now();
      const l2_results = this.dataService.search_l2(query);
      t1 = Date.now();
      console.log(
        `Performed L2 search of ${
          this.dataService.$entriesLength.value
        } entries in ${(t1 - t0).toString()} ms`
      );
      const results = l1_results.concat(l2_results);
      console.log(sortResults(results));
      this.searchService.matches = sortResults(
        results.filter((result) => result[0] < this.partialThreshold)
      );
      this.searchService.partMatches = sortResults(
        results.filter(
          (result) =>
            result[0] >= this.partialThreshold &&
            result[0] < this.maybeThreshold
        )
      );
      this.searchService.maybeMatches = sortResults(
        results.filter((result) => result[0] >= this.maybeThreshold)
      );
    }
  }
}
