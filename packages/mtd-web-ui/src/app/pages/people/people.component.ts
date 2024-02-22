import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';
import { META } from '../../../config/config';

@Component({
  selector: 'mtd-people',
  templateUrl: './people.component.html',
  styleUrls: [
    './people.component.scss',
    '../../shared/layout/single/single.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleComponent {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  contributors = META.contributors;
}
