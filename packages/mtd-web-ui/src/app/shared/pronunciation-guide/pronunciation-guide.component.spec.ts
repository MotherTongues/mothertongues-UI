import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PronunciationGuideComponent } from './pronunciation-guide.component';

describe('PronunciationGuideComponent', () => {
  let component: PronunciationGuideComponent;
  let fixture: ComponentFixture<PronunciationGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule],
      declarations: [PronunciationGuideComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PronunciationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
