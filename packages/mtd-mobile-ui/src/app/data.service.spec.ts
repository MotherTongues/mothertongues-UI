import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { environment } from '../environments/environment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sampleData = require('../assets/dictionary_data.json');

describe('DataService', () => {
  function loadWithSources(sources: string[]) {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    const dataService = TestBed.inject(DataService);
    const data = JSON.parse(JSON.stringify(sampleData));
    data.data.forEach((entry: { source: string }, i: number) => {
      entry.source = sources[i % sources.length];
    });
    TestBed.inject(HttpTestingController)
      .expectOne(environment.dataPath)
      .flush(data);
    return dataService;
  }

  it('does not add a category for a single source', () => {
    const categories = loadWithSources(['starter']).$categories.value;
    expect(categories).not.toContain('starter');
    expect(categories[0]).toBe('All');
  });

  it('adds a category for each source when there are several', () => {
    const categories = loadWithSources(['b-source', 'a-source']).$categories.value;
    expect(categories.slice(0, 3)).toEqual(['All', 'a-source', 'b-source']);
  });
});
