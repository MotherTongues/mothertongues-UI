import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowsePage } from './browse.page';
import { IonicModule } from '@ionic/angular';


describe('BrowsePage', () => {
  let component: BrowsePage;
  let fixture: ComponentFixture<BrowsePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BrowsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
