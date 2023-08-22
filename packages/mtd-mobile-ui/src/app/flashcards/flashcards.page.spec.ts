import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlashcardsPage } from './flashcards.page';
import { IonicModule } from '@ionic/angular';

describe('FlashcardsPage', () => {
  let component: FlashcardsPage;
  let fixture: ComponentFixture<FlashcardsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FlashcardsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FlashcardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
