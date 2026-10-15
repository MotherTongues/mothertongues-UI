import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    }).compileComponents();
    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(5);
    expect(menuItems[0].textContent).toContain('Search');
    expect(menuItems[1].textContent).toContain('Browse');
  });

  it('should have urls', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    // ng-reflect-* attributes are no longer rendered, so read the RouterLinks
    const urls = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((el) => el.injector.get(RouterLink).urlTree?.toString());
    expect(urls).toEqual([
      '/search',
      '/browse',
      '/bookmarks',
      '/flashcards',
      '/about',
    ]);
  });
});
