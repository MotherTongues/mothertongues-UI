import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'mtd-single',
  styleUrls: ['./single.component.scss'],
  templateUrl: './single.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleComponent {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
}
