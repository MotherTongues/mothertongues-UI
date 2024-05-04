import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class SettingsService {
  showOptionalInfo$ = new BehaviorSubject<boolean | null>(sessionStorage.getItem('showOptionalInfo') == 'true');
  constructor() {
    this.showOptionalInfo$.subscribe({'next': (x) => sessionStorage.setItem('showOptionalInfo', (x === true).toString())})
  }

}