import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { Subscription, combineLatest } from 'rxjs';
import { Audio1, DictionaryEntryExportFormat } from '@mothertongues/search';
import { DataService } from '../data.service';
import { BookmarksService } from '../shared/bookmarks.service';
import {
  BOOKMARKS_DECK,
  DeckOption,
  Flashcard,
  FlashcardDirection,
  FlashcardSide,
  FlashcardsService,
  buildCategoryDecks,
} from './flashcards.service';

// Minimum horizontal distance (px) for a drag to count as a swipe
const SWIPE_THRESHOLD = 60;

@Component({
    selector: 'mtd-flashcards',
    templateUrl: './flashcards.page.html',
    styleUrls: ['./flashcards.page.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FlashcardsPage implements OnInit, OnDestroy {
  readonly BOOKMARKS_DECK = BOOKMARKS_DECK;
  categoryDecks: DeckOption[] = [];
  bookmarks: DictionaryEntryExportFormat[] = [];
  L1 = 'L1';
  L2 = 'L2';
  playing = false;
  private audio?: HTMLAudioElement;
  private gesture?: Gesture;
  // Set when a swipe ends so the click that follows it doesn't flip the card
  private swiped = false;
  private subscriptions = new Subscription();

  @ViewChild('card', { read: ElementRef })
  set card(card: ElementRef<HTMLElement> | undefined) {
    this.gesture?.destroy();
    this.gesture = undefined;
    if (card) {
      this.gesture = this.gestureCtrl.create(
        {
          el: card.nativeElement,
          gestureName: 'flashcard-swipe',
          direction: 'x',
          threshold: 15,
          onEnd: (detail) => this.onSwipe(detail.deltaX),
        },
        true
      );
      this.gesture.enable();
    }
  }

  constructor(
    public dataService: DataService,
    public bookmarksService: BookmarksService,
    public flashcards: FlashcardsService,
    private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.dataService.$config.subscribe((config) => {
        if (config) {
          this.L1 = config.L1;
          this.L2 = config.L2;
        }
      })
    );
    this.subscriptions.add(
      combineLatest([
        this.dataService.$categories,
        this.dataService.$categorizedEntries,
        this.bookmarksService.$bookmarks,
      ]).subscribe(([categories, categorizedEntries, bookmarks]) => {
        this.categoryDecks = buildCategoryDecks(categories, categorizedEntries);
        this.bookmarks = bookmarks;
        this.ensureDeckSelected();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.gesture?.destroy();
    this.stopAudio();
  }

  get hasDecks(): boolean {
    return this.bookmarks.length > 0 || this.categoryDecks.length > 0;
  }

  get selectedDeckSize(): number {
    return this.deckEntries(this.flashcards.deckID).length;
  }

  /**
   * Keep the selected deck if it still has cards, otherwise default to the
   * bookmarks, then to the first category (All).
   */
  ensureDeckSelected() {
    if (this.deckEntries(this.flashcards.deckID).length > 0) return;
    if (this.bookmarks.length > 0) {
      this.flashcards.deckID = BOOKMARKS_DECK;
    } else {
      this.flashcards.deckID = this.categoryDecks[0]?.id ?? null;
    }
  }

  deckEntries(deckID: string | null): DictionaryEntryExportFormat[] {
    if (deckID === BOOKMARKS_DECK) return this.bookmarks;
    return (
      this.categoryDecks.find((deck) => deck.id === deckID)?.entries ?? []
    );
  }

  deckLabel(deck: DeckOption): string {
    // ion-select options only render text, so indent secondary themes with
    // non-breaking spaces
    const indent = deck.level === 1 ? '    ' : '';
    return `${indent}${deck.label} (${deck.entries.length})`;
  }

  onDeckChange(event: Event) {
    this.flashcards.deckID = (event as CustomEvent).detail.value;
  }

  onDirectionChange(event: Event) {
    this.flashcards.direction = (event as CustomEvent).detail
      .value as FlashcardDirection;
  }

  start() {
    this.flashcards.start(this.deckEntries(this.flashcards.deckID));
  }

  changeDeck() {
    this.stopAudio();
    this.flashcards.stop();
  }

  sideText(card: Flashcard, side: FlashcardSide): string {
    return side === 'L1' ? card.entry.word : card.entry.definition;
  }

  backSide(card: Flashcard): FlashcardSide {
    return card.front === 'L1' ? 'L2' : 'L1';
  }

  flip() {
    if (this.swiped) {
      this.swiped = false;
      return;
    }
    this.stopAudio();
    this.flashcards.flip();
  }

  next() {
    this.stopAudio();
    this.flashcards.next();
  }

  previous() {
    this.stopAudio();
    this.flashcards.previous();
  }

  shuffle() {
    this.stopAudio();
    this.flashcards.shuffle();
  }

  restart() {
    this.stopAudio();
    this.flashcards.restart();
  }

  onSwipe(deltaX: number) {
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    this.swiped = true;
    // A touch swipe isn't followed by a click, so don't leave the flag set
    setTimeout(() => (this.swiped = false), 300);
    if (deltaX < 0) {
      this.next();
    } else {
      this.previous();
    }
  }

  playableAudio(entry: DictionaryEntryExportFormat): Audio1[] {
    return (entry.audio ?? []).filter((audio) => audio.filename);
  }

  playAudio(audio: Audio1) {
    this.stopAudio();
    this.audio = new Audio(audio.filename);
    this.audio.onplay = () => (this.playing = true);
    this.audio.onpause = () => (this.playing = false);
    this.audio.onended = () => (this.playing = false);
    this.audio.onerror = (err) => {
      console.log(err);
      this.playing = false;
    };
    this.audio.play();
  }

  stopAudio() {
    this.audio?.pause();
    this.audio = undefined;
    this.playing = false;
  }
}
