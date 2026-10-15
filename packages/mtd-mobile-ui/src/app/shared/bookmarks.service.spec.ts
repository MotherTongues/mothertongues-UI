import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  DictionaryEntryExportFormat,
  LanguageConfigurationExportFormat,
} from '@mothertongues/search';
import { DataService } from '../data.service';
import { BookmarksService } from './bookmarks.service';

const KEY = 'mtd-bookmarks-French-English-123';

function makeEntry(entryID: string): DictionaryEntryExportFormat {
  return {
    entryID,
    word: `word-${entryID}`,
    definition: `definition-${entryID}`,
    sorting_form: [0],
  } as unknown as DictionaryEntryExportFormat;
}

describe('BookmarksService', () => {
  let dataService: DataService;
  const entries = ['a', 'b', 'c'].map(makeEntry);

  function loadData() {
    dataService.$config.next({
      L1: 'French',
      L2: 'English',
      build: '123',
    } as unknown as LanguageConfigurationExportFormat);
    dataService.$entriesHash.next(
      Object.fromEntries(entries.map((e) => [e.entryID, e]))
    );
    dataService.$loaded.next(true);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    dataService = TestBed.inject(DataService);
  });

  it('loads saved bookmarks once the data has loaded, skipping unknown IDs', () => {
    localStorage.setItem(KEY, JSON.stringify(['c', 'missing', 'a']));
    const service = TestBed.inject(BookmarksService);
    expect(service.$bookmarks.value).toEqual([]);
    loadData();
    expect(service.$bookmarks.value.map((e) => e.entryID)).toEqual(['c', 'a']);
  });

  it('toggles bookmarks, saves them, and emits a new array each time', () => {
    const service = TestBed.inject(BookmarksService);
    loadData();
    const before = service.$bookmarks.value;
    service.toggleBookmark(entries[1]);
    expect(service.$bookmarks.value).not.toBe(before);
    expect(service.isBookmarked(entries[1])).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(['b']);

    service.toggleBookmark(entries[1]);
    expect(service.isBookmarked(entries[1])).toBe(false);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([]);
  });

  it('removes a set of bookmarks', () => {
    const service = TestBed.inject(BookmarksService);
    loadData();
    service.setBookmarks(entries);
    service.removeBookmarks(new Set(['a', 'c']));
    expect(service.$bookmarks.value.map((e) => e.entryID)).toEqual(['b']);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(['b']);
  });
});
