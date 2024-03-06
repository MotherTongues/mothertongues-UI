import { Injectable } from '@angular/core';
import { AnimationsService } from '../animations/animations.service';

export interface SettingsState {
  language: string;
  theme: string;
  autoNightMode: boolean;
  nightTheme: string;
  pageAnimations: boolean;
  elementsAnimations: boolean;
  hour: number;
}

const DEFAULT_STATE: SettingsState = {
  language: 'en',
  theme: 'default-theme',
  autoNightMode: false,
  nightTheme: 'black-theme',
  pageAnimations: true,
  elementsAnimations: true,
  hour: 12,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public state: SettingsState;

  constructor(private animations: AnimationsService) {
    const key = this.localStorageKey();
    const data = localStorage.getItem(key);
    if (data === null) this.state = DEFAULT_STATE;
    else {
      this.state = JSON.parse(data);
      console.log(`Loaded settings from ${key}`);
    }
    this.animations.updateRouteAnimationType(
      this.state.pageAnimations,
      this.state.elementsAnimations
    );
  }

  localStorageKey(): string {
    return 'mtd-settings';
  }

  saveState() {
    const key = this.localStorageKey();
    localStorage.setItem(key, JSON.stringify(this.state));
    console.log(`Saved settings to ${key}`);
  }

  get language() {
    return this.state.language;
  }
  set language(val: string) {
    this.state.language = val;
    this.saveState();
  }

  get theme() {
    return this.state.theme;
  }
  set theme(val: string) {
    this.state.theme = val;
    this.saveState();
  }

  get autoNightMode() {
    return this.state.autoNightMode;
  }
  set autoNightMode(val: boolean) {
    this.state.autoNightMode = val;
    this.saveState();
  }

  get pageAnimations() {
    return this.state.pageAnimations;
  }
  set pageAnimations(val: boolean) {
    this.state.pageAnimations = val;
    // FIXME: Use this very bogus API for the moment (should just rely
    // on change detection like everything else)
    this.animations.updateRouteAnimationType(
      this.state.pageAnimations,
      this.state.elementsAnimations
    );
    this.saveState();
  }

  get elementsAnimations() {
    return this.state.elementsAnimations;
  }
  set elementsAnimations(val: boolean) {
    this.state.elementsAnimations = val;
    this.animations.updateRouteAnimationType(
      this.state.pageAnimations,
      this.state.elementsAnimations
    );
    this.saveState();
  }
}
