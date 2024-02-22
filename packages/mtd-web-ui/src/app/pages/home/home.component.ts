import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';

@Component({
  selector: 'mtd-home',
  templateUrl: './home.component.html',
  styleUrls: [
    '../../shared/layout/single/single.component.scss',
    './home.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
}
