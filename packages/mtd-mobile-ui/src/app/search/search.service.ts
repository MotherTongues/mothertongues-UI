import { Injectable } from '@angular/core';
import { DataService } from '../data.service';

import { Result } from '@mothertongues/search';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchQuery = '';
  matches: Result[] = [];
  partMatches: Result[] = [];
  maybeMatches: Result[] = [];
  constructor(public dataService: DataService) {}
}
