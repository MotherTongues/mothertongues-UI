import { Component, OnInit } from '@angular/core';
import { SearchService, Result } from '../search.service';
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

  linearSearch(query:string){
    const regex = new RegExp(query)
    return ENTRIES.filter((word) => word.word.match(regex) || word.definition.match(regex))
  }

  search(ev: Event) {
    if (ev.target === null) {
      return
    }
    
    const query = (ev.target as HTMLTextAreaElement).value
    this.searchQuery = query;
    if (query.length > 1) {
      let t0 = Date.now();
      const results = this.searchService.search_l1(query).concat(this.searchService.search_l2(query)).sort((a, b) => a[0] - b[0])
      let t1 = Date.now();
      console.log(`Performed search of ${ENTRIES.length} entries in ${(t1-t0).toString()} ms`)
      t0 = Date.now();
      const linearResults = this.linearSearch(query);
      t1 = Date.now();
      console.log(linearResults)
      console.log(`Performed linear search of ${ENTRIES.length} entries in ${(t1-t0).toString()} ms`)
      this.matches = results.filter((result) => result[0] < this.partialThreshold)
      this.partMatches = results.filter((result) => result[0] >= this.partialThreshold && result[0] < this.maybeThreshold )
      this.maybeMatches = results.filter((result) => result[0] >= this.maybeThreshold)
    }
  }
}
