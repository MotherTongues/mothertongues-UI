import browser from 'browser-detect';
import { Component,  OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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
import { RouterOutlet } from '@angular/router';

interface MenuItem {
  link: string;
  label: string;
  children?: Array<MenuItem>;
}

@Component({
  selector: 'mothertongues-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnDestroy {
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
  ) {
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

  private static isIEorEdgeOrSafari() {
    const browserObj = browser();
    const browserName = browserObj.name || "";
    return ['ie', 'edge', 'safari'].includes(browserName);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onLanguageSelect(event: MatSelectChange) {
    this.store.dispatch(actionSettingsChangeLanguage(event.value));
  }

  getRouteAnimations(o: RouterOutlet) {
    // FIXME: What does this even do?!?!?
    return o.isActivated && o.activatedRoute.routeConfig?.data?.title;
  }
}
