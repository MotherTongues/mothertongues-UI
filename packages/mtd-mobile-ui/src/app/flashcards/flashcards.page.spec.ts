import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
import { FlashcardsPage } from './flashcards.page';
import { DataService } from '../data.service';
import { BookmarksService } from '../shared/bookmarks.service';
import { BOOKMARKS_DECK } from './flashcards.service';

function makeEntry(entryID: string, theme: string): DictionaryEntryExportFormat {
  return {
    entryID,
    word: `word-${entryID}`,
    definition: `definition-${entryID}`,
    sorting_form: [0],
    theme,
  } as unknown as DictionaryEntryExportFormat;
}

describe('FlashcardsPage', () => {
  let component: FlashcardsPage;
  let fixture: ComponentFixture<FlashcardsPage>;
  let dataService: DataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FlashcardsPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();

    dataService = TestBed.inject(DataService);
    const entries = [makeEntry('1', 'vegetables'), makeEntry('2', 'animals')];
    dataService.$categories.next(['All', 'animals', 'vegetables']);
    dataService.$categorizedEntries.next({
      All: entries,
      animals: [entries[1]],
      vegetables: [entries[0]],
    });
    fixture = TestBed.createComponent(FlashcardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to All when there are no bookmarks', () => {
    expect(component.categoryDecks.map((d) => d.label)).toEqual([
      'All',
      'animals',
      'vegetables',
    ]);
    expect(component.flashcards.deckID).toBe(component.categoryDecks[0].id);
    expect(component.selectedDeckSize).toBe(2);
  });

  it('switches to the bookmarks deck once there are bookmarks', () => {
    component.flashcards.deckID = null;
    TestBed.inject(BookmarksService).$bookmarks.next([
      makeEntry('1', 'vegetables'),
    ]);
    expect(component.flashcards.deckID).toBe(BOOKMARKS_DECK);
    component.start();
    expect(component.flashcards.cards.length).toBe(1);
  });
});
