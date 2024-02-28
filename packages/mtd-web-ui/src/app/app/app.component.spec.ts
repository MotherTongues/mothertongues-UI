import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SharedModule,
          RouterTestingModule,
          NoopAnimationsModule,
          TranslateModule.forRoot()
        ],
        declarations: [AppComponent]
      }).compileComponents();

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
