import { DictionaryEntryExportFormat } from '@mothertongues/search';
import {
  FlashcardsService,
  buildCards,
  buildCategoryDecks,
  shuffle,
} from './flashcards.service';

function makeEntry(
  entryID: string,
  theme: string | null = null,
  secondary_theme: string | null = null
): DictionaryEntryExportFormat {
  return {
    entryID,
    word: `word-${entryID}`,
    definition: `definition-${entryID}`,
    sorting_form: [0],
    theme,
    secondary_theme,
  } as unknown as DictionaryEntryExportFormat;
}

describe('buildCategoryDecks', () => {
  it('keeps the category order and nests sorted secondary themes under their theme', () => {
    const entries = [
      makeEntry('1', 'animals', 'mammals'),
      makeEntry('2', 'animals', 'birds'),
      makeEntry('3', 'animals'),
      makeEntry('4', 'animals', 'birds'),
      makeEntry('5', 'plants'),
    ];
    const decks = buildCategoryDecks(['All', 'animals', 'plants'], {
      All: entries,
      animals: entries.slice(0, 4),
      plants: entries.slice(4),
    });
    expect(decks.map((d) => [d.level, d.label, d.entries.length])).toEqual([
      [0, 'All', 5],
      [0, 'animals', 4],
      [1, 'birds', 2],
      [1, 'mammals', 1],
      [0, 'plants', 1],
    ]);
    expect(new Set(decks.map((d) => d.id)).size).toBe(decks.length);
  });

  it("skips empty categories and 'null' secondary themes", () => {
    const entries = [makeEntry('1', 'animals', 'null')];
    const decks = buildCategoryDecks(['All', 'animals', 'empty'], {
      All: entries,
      animals: entries,
    });
    expect(decks.map((d) => [d.level, d.label])).toEqual([
      [0, 'All'],
      [0, 'animals'],
    ]);
  });
});

describe('buildCards', () => {
  const entries = ['1', '2', '3', '4'].map((id) => makeEntry(id));

  it('uses the chosen side as the front', () => {
    expect(buildCards(entries, 'L1-L2').map((c) => c.front)).toEqual([
      'L1',
      'L1',
      'L1',
      'L1',
    ]);
    expect(buildCards(entries, 'L2-L1').map((c) => c.front)).toEqual([
      'L2',
      'L2',
      'L2',
      'L2',
    ]);
  });

  it('picks a random front for each card when mixed', () => {
    const randoms = [0.1, 0.9, 0.4, 0.6];
    const cards = buildCards(entries, 'mixed', () => randoms.shift()!);
    expect(cards.map((c) => c.front)).toEqual(['L1', 'L2', 'L1', 'L2']);
  });
});

describe('shuffle', () => {
  it('returns a new array with the same items', () => {
    const items = [1, 2, 3, 4, 5];
    const shuffled = shuffle(items);
    expect(shuffled).not.toBe(items);
    expect([...shuffled].sort()).toEqual(items);
  });
});

describe('FlashcardsService', () => {
  let service: FlashcardsService;
  const entries = ['1', '2', '3'].map((id) => makeEntry(id));

  beforeEach(() => {
    service = new FlashcardsService();
    service.start(entries);
  });

  it('moves through the deck without going past either end', () => {
    expect(service.studying).toBe(true);
    service.previous();
    expect(service.index).toBe(0);
    service.next();
    service.next();
    service.next();
    expect(service.index).toBe(2);
    expect(service.current?.entry.entryID).toBe('3');
  });

  it('shows the front of each new card', () => {
    service.flip();
    expect(service.flipped).toBe(true);
    service.next();
    expect(service.flipped).toBe(false);
  });

  it('restarts and shuffles from the first card', () => {
    service.next();
    service.flip();
    service.shuffle();
    expect(service.index).toBe(0);
    expect(service.flipped).toBe(false);
    expect(service.cards.length).toBe(3);
  });

  it('does not start studying an empty deck', () => {
    service.start([]);
    expect(service.studying).toBe(false);
  });
});
