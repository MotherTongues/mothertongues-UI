import { Component, ChangeDetectionStrategy } from '@angular/core';
import { META } from '../../../config/config';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/route.animations';
import { SettingsService } from '../../core/settings.service';

@Component({
  selector: 'mtd-settings',
  templateUrl: './settings-container.component.html',
  styleUrls: [
    './settings-container.component.scss',
    '../../shared/layout/single/single.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsContainerComponent {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  themes = [
    { value: 'default-theme', label: marker('blue') },
    { value: 'light-theme', label: marker('light') },
    { value: 'nature-theme', label: marker('nature') },
    { value: 'black-theme', label: marker('dark') },
  ];
  languages = META.languages.map((x) => {
    return {
      value: x.value,
      label: marker(`mtd.settings.general.language.${x.value}`),
    };
  });

  constructor(public settings: SettingsService) {
  }
}
