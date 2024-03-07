import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  let service: BookmarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookmarksService]
    });
    service = TestBed.inject(BookmarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
