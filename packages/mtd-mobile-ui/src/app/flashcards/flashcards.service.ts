import { Injectable } from '@angular/core';
import { DictionaryEntryExportFormat } from '@mothertongues/search';

export type FlashcardDirection = 'L1-L2' | 'L2-L1' | 'mixed';
export type FlashcardSide = 'L1' | 'L2';

export const BOOKMARKS_DECK = 'bookmarks';

export interface DeckOption {
  id: string;
  label: string;
  // 0 for a category, 1 for a secondary_theme nested under its theme
  level: 0 | 1;
  entries: DictionaryEntryExportFormat[];
}

export interface Flashcard {
  entry: DictionaryEntryExportFormat;
  front: FlashcardSide;
}

function hasValue(value: string | null | undefined): value is string {
  return !!value && value !== 'null';
}

/**
 * Build a deck for each category from DataService (All, sources and themes, in
 * that order), with each theme's `secondary_theme`s nested under it and sorted
 * alphabetically.
 */
export function buildCategoryDecks(
  categories: string[],
  categorizedEntries: { [category: string]: DictionaryEntryExportFormat[] },
): DeckOption[] {
  const options: DeckOption[] = [];
  categories.forEach((category, i) => {
    const entries = categorizedEntries[category] ?? [];
    if (entries.length === 0) return;
    options.push({ id: `category-${i}`, label: category, level: 0, entries });
    const secondaryThemes = new Map<string, DictionaryEntryExportFormat[]>();
    for (const entry of entries) {
      if (entry.theme === category && hasValue(entry.secondary_theme)) {
        const secondary = secondaryThemes.get(entry.secondary_theme) ?? [];
        secondary.push(entry);
        secondaryThemes.set(entry.secondary_theme, secondary);
      }
    }
    [...secondaryThemes.keys()].sort().forEach((secondaryTheme, j) => {
      options.push({
        id: `category-${i}-${j}`,
        label: secondaryTheme,
        level: 1,
        entries: secondaryThemes.get(secondaryTheme) ?? [],
      });
    });
  });
  return options;
}

export function buildCards(
  entries: DictionaryEntryExportFormat[],
  direction: FlashcardDirection,
  random: () => number = Math.random,
): Flashcard[] {
  return entries.map((entry) => ({
    entry,
    front:
      direction === 'L1-L2'
        ? 'L1'
        : direction === 'L2-L1'
          ? 'L2'
          : random() < 0.5
            ? 'L1'
            : 'L2',
  }));
}

export function shuffle<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Holds the flashcard session so it survives navigating away from the page.
 */
@Injectable({
  providedIn: 'root',
})
export class FlashcardsService {
  deckID: string | null = null;
  direction: FlashcardDirection = 'L1-L2';
  studying = false;
  cards: Flashcard[] = [];
  index = 0;
  flipped = false;

  get current(): Flashcard | undefined {
    return this.cards[this.index];
  }

  start(entries: DictionaryEntryExportFormat[]) {
    this.cards = buildCards(entries, this.direction);
    this.index = 0;
    this.flipped = false;
    this.studying = this.cards.length > 0;
  }

  stop() {
    this.studying = false;
  }

  flip() {
    this.flipped = !this.flipped;
  }

  next() {
    if (this.index < this.cards.length - 1) {
      this.index++;
      this.flipped = false;
    }
  }

  previous() {
    if (this.index > 0) {
      this.index--;
      this.flipped = false;
    }
  }

  shuffle() {
    this.cards = shuffle(this.cards);
    this.restart();
  }

  restart() {
    this.index = 0;
    this.flipped = false;
  }
}
