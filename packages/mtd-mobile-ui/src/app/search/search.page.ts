import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Result } from '@mothertongues/search';
import { ENTRIES } from '../../config/entries';

@Component({
  selector: 'mtd-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchQuery = "";
  matches: Result[] = [];
  partMatches: Result[] = [];
  maybeMatches: Result[] = [];
  partialThreshold = 1;
  maybeThreshold = 2;
  constructor(public searchService: SearchService) {}

  ngOnInit(): void {
  }

  search(ev: Event) {
    if (ev.target === null) {
      return
    }
    
    const query = (ev.target as HTMLTextAreaElement).value
    this.searchQuery = query;
    if (query.length > 1) {
      const t0 = Date.now();
      // TODO: should be a better way to join results, this could have duplicates
      const results = this.searchService.search_l1(query).concat(this.searchService.search_l2(query)).sort((a, b) => b[0] - a[0])
      const t1 = Date.now();
      console.log(`Performed search of ${ENTRIES.length} entries in ${(t1-t0).toString()} ms`)
      this.matches = results.filter((result) => result[0] < this.partialThreshold).sort((a, b) => b[3] - a[3])
      this.partMatches = results.filter((result) => result[0] >= this.partialThreshold && result[0] < this.maybeThreshold ).sort((a, b) => b[3] - a[3])
      this.maybeMatches = results.filter((result) => result[0] >= this.maybeThreshold).sort((a, b) => b[3] - a[3])
    }
  }
}
