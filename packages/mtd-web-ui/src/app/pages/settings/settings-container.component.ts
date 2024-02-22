import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { META } from '../../../config/config';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';

import {
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeLanguage,
  actionSettingsChangeTheme,
} from '../../core/settings/settings.actions';
import { SettingsState, State } from '../../core/settings/settings.model';
import { selectSettings } from '../../core/settings/settings.selectors';

@Component({
  selector: 'mtd-settings',
  templateUrl: './settings-container.component.html',
  styleUrls: [
    './settings-container.component.scss',
    '../../shared/layout/single/single.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsContainerComponent implements OnInit {
  displayNav = true;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  settings$: Observable<SettingsState>;

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

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.settings$ = this.store.pipe(select(selectSettings));
  }

  onLanguageSelect(event: MatSelectChange) {
    this.store.dispatch(actionSettingsChangeLanguage(event.value));
  }

  onThemeSelect(event: MatSelectChange) {
    this.store.dispatch(actionSettingsChangeTheme(event.value));
  }

  onAutoNightModeToggle(event: MatSlideToggleChange) {
    this.store.dispatch(
      actionSettingsChangeAutoNightMode({ autoNightMode: event.checked })
    );
  }

  onPageAnimationsToggle(event: MatSlideToggleChange) {
    this.store.dispatch(
      actionSettingsChangeAnimationsPage({ pageAnimations: event.checked })
    );
  }

  onElementsAnimationsToggle(event: MatSlideToggleChange) {
    this.store.dispatch(
      actionSettingsChangeAnimationsElements({
        elementsAnimations: event.checked,
      })
    );
  }
}
