import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { META } from '../../../config/config';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';
import { SettingsState } from '../../core/settings/settings.model';

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
  displayNav = true;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  settings: SettingsState = {
    language: "en",
    theme: "DEFAULT-THEME",
    autoNightMode: false,
    nightTheme: "BLACK-THEME",
    pageAnimations: true,
    pageAnimationsDisabled: false,
    elementsAnimations: true,
    hour: 12
  };

  themes = [
    { value: 'DEFAULT-THEME', label: 'blue' },
    { value: 'LIGHT-THEME', label: 'light' },
    { value: 'NATURE-THEME', label: 'nature' },
    { value: 'BLACK-THEME', label: 'dark' },
  ];

  languages = META.languages.map((x) => {
    return {
      value: x.value,
      label: marker(`mtd.settings.general.language.${x.value}`),
    };
  });

  /* FIXME: can just use ngModel for all of this obviously */
  onLanguageSelect(event: MatSelectChange) {
    this.settings.language = event.value;
  }

  onThemeSelect(event: MatSelectChange) {
    this.settings.theme = event.value;
  }

  onAutoNightModeToggle(event: MatSlideToggleChange) {
    this.settings.autoNightMode = event.checked;
  }

  onPageAnimationsToggle(event: MatSlideToggleChange) {
    this.settings.pageAnimations = event.checked;
  }

  onElementsAnimationsToggle(event: MatSlideToggleChange) {
    this.settings.elementsAnimations = event.checked;
  }
}
