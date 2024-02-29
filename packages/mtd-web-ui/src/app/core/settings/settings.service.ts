import { Injectable } from '@angular/core';
import { LocalStorageService } from '../core.module';
import { AnimationsService } from "../animations/animations.service";

const SETTINGS_KEY = "settings";
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
  language: "en",
  theme: "default-theme",
  autoNightMode: false,
  nightTheme: "black-theme",
  pageAnimations: true,
  elementsAnimations: true,
  hour: 12,
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public state: SettingsState;

  constructor(private localStorage: LocalStorageService,
              private animations: AnimationsService) {
    const stored = this.localStorage.getItem(SETTINGS_KEY);
    if (stored)
      this.state = stored;
    else {
      this.state = DEFAULT_STATE;
    }
    this.animations.updateRouteAnimationType(this.state.pageAnimations,
                                             this.state.elementsAnimations);
  }

  get language() { return this.state.language; }
  set language(val: string) { this.state.language = val; }

  get theme() { return this.state.theme; }
  set theme(val: string) { this.state.theme = val; }

  get autoNightMode() { return this.state.autoNightMode; }
  set autoNightMode(val: boolean) { this.state.autoNightMode = val; }
  
  get pageAnimations() { return this.state.pageAnimations; }
  set pageAnimations(val: boolean) {
    this.state.pageAnimations = val;
    // FIXME: Use this very bogus API for the moment (should just rely
    // on change detection like everything else)
    this.animations.updateRouteAnimationType(this.state.pageAnimations,
                                             this.state.elementsAnimations);
  }
  
  get elementsAnimations() { return this.state.elementsAnimations; }
  set elementsAnimations(val: boolean) {
    this.state.elementsAnimations = val;
    this.animations.updateRouteAnimationType(this.state.pageAnimations,
                                             this.state.elementsAnimations);
  }
}
