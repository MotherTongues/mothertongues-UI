import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'mtd-flashcards',
    templateUrl: './flashcards.page.html',
    styleUrls: ['./flashcards.page.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FlashcardsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
