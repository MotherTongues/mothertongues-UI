import browser from 'browser-detect';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { environment as env } from '../../environments/environment';
import { META } from '../../config/config';

import {
  routeAnimations,
  LocalStorageService,
  selectSettingsLanguage,
  selectEffectiveTheme
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage
} from '../core/settings/settings.actions';
import { SPEAKERS } from '../pages/speakers/speakers.component';

interface MenuItem {
  link: string;
  label: string;
  children?: Array<MenuItem>;
}

@Component({
  selector: 'mtd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit, OnDestroy {
  displayNav = false;
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = 'assets/logo.png';
  languages = META.languages;
  Meta = META;
  navigation: Array<MenuItem> = [
    { link: 'search', label: marker('mtd.menu.search') },
    { link: 'browse', label: marker('mtd.menu.browse') },
    { link: 'random', label: marker('mtd.menu.random') },
    { link: 'bookmarks', label: marker('mtd.menu.bookmarks') },
    {
      link: 'about',
      label: marker('mtd.menu.about'),
      children: [
        { link: 'about', label: marker('mtd.menu.about') },
        { link: 'introduction', label: marker('mtd.menu.introduction') },
        { link: 'people', label: marker('mtd.menu.people') }
      ]
    },
    {
      link: 'speakers',
      label: marker('mtd.menu.speakers'),
      children: Object.entries(SPEAKERS).map(([id, name]) => {
        return { link: `speakers/${id}`, label: name };
      })
    }
  ];
  navigationSideMenu: Array<MenuItem> = [
    ...this.navigation,
    { link: 'settings', label: 'mtd.menu.settings' }
  ];

  language$: Observable<string>;
  theme$: Observable<string>;
  unsubscribe$ = new Subject<void>();
  constructor(
    private store: Store,
    private storageService: LocalStorageService
  ) {}

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }
}
