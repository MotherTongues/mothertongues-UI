import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  selectEffectiveTheme,
  selectSettingsLanguage
} from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let store: MockStore;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SharedModule,
          RouterTestingModule,
          NoopAnimationsModule,
          TranslateModule.forRoot()
        ],
        providers: [provideMockStore()],
        declarations: [AppComponent]
      }).compileComponents();

      store = TestBed.inject(MockStore);
      store.overrideSelector(selectSettingsLanguage, 'en');
      store.overrideSelector(selectEffectiveTheme, 'default');
    })
  );

  it(
    'should create the app',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
});
