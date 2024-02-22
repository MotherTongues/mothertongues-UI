import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';
import { PronunciationGuideComponent } from '../../shared/pronunciation-guide/pronunciation-guide.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mtd-about',
  templateUrl: './about.component.html',
  styleUrls: [
    '../../shared/layout/single/single.component.scss',
    './about.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  tmd = 'assets/tmd.png';
  funding = 'assets/funding.png';

  constructor(public dialog: MatDialog) {}
  openPronunciation() {
    this.dialog.open(PronunciationGuideComponent);
  }
}
