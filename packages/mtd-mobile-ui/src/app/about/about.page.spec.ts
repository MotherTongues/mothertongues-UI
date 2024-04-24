import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AboutPage } from './about.page';
import { IonicModule } from '@ionic/angular';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should have correct title', () => {
    const app = fixture.nativeElement;

    const header = app.querySelectorAll('ion-header');
    expect(header.length).toEqual(2);

    // first title
    const title = header[0].querySelectorAll('ion-title');
    expect(title.length).toEqual(1);
    expect(title[0].textContent).toEqual('About');

    // second title
    const title2 = header[1].querySelectorAll('ion-title');
    expect(title2.length).toEqual(1);
    expect(title2[0].textContent).toEqual('about');
  });
});
