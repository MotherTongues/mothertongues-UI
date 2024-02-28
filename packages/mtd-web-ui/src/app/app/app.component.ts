import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { environment as env } from '../../environments/environment';
import { META } from '../../config/config';

import {
  routeAnimations,
  LocalStorageService,
} from '../core/core.module';
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

  language = "en";
  theme = "nature-theme";
  constructor(private storageService: LocalStorageService) {
    this.storageService.testLocalStorage();
  }

  onLanguageSelect(event: MatSelectChange) {
    //this.store.dispatch(actionSettingsChangeLanguage(event.value));
  }

  getRouteAnimations(o: RouterOutlet) {
    // FIXME: What does this even do?!?!?
    return o.isActivated && o.activatedRoute.routeConfig?.data?.title;
  }
}
