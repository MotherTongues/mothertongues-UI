import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BookmarksPage } from './bookmarks.page';
import { SharedModule } from '../shared/shared.module';
import { BookmarksService } from '../shared/bookmarks.service';
import { DictionaryEntryExportFormat } from '@mothertongues/search';

describe('BookmarksPage', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let component: BookmarksPage;
  let fixture: ComponentFixture<BookmarksPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarksPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, SharedModule],
    }).compileComponents();

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BookmarksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows instructions when there are no bookmarks', () => {
    expect(fixture.nativeElement.textContent).toContain(
      "You haven't bookmarked any words yet."
    );
  });

  it('removes the selected bookmarks and leaves edit mode', () => {
    const bookmarksService = TestBed.inject(BookmarksService);
    const entries = ['a', 'b'].map(
      (entryID) =>
        ({ entryID, word: entryID, definition: entryID } as unknown as DictionaryEntryExportFormat)
    );
    bookmarksService.$bookmarks.next(entries);
    component.toggleEdit();
    component.onSelectionChange(new Set(['a']));
    component.removeEntries();
    expect(bookmarksService.$bookmarks.value.map((e) => e.entryID)).toEqual(['b']);
    expect(component.edit).toBe(false);
    expect(component.selected.size).toBe(0);
  });
});
