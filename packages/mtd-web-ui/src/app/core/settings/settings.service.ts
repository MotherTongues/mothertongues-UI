import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public language = "en";
  public theme =  "default-theme";
  public autoNightMode = false;
  public nightTheme = "black-theme";
  public pageAnimations = true;
  public elementsAnimations = true;
  public hour = 12;
}
