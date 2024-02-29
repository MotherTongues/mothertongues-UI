import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { environment as env } from '../../environments/environment';
import { META } from '../../config/config';

import {
  routeAnimations,
  SettingsService,
  LocalStorageService,
} from '../core/core.module';

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
export class AppComponent {
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

  constructor(private storageService: LocalStorageService,
              public settings: SettingsService) {
    this.storageService.testLocalStorage();
  }

  getRouteAnimations(o: RouterOutlet) {
    if (o.isActivated) {
      /* Gets the i18n label for the current page */
      return o.activatedRoute.routeConfig?.data?.title;
    }
    return "";
  }
}
