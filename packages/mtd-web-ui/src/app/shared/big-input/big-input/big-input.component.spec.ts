import { Component, DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared.module';

@Component({
  selector: 'mtd-host-for-test',
  template: `
    <mtd-big-input
      placeholder="I am going to do..."
      [value]="newValue"
      (keyup)="onKeyEvent($event)"
      (keyup.enter)="onKeyEvent($event)"
      (keyup.escape)="onKeyEvent($event)"
    >
    </mtd-big-input>
  `,
})
class HostComponent {
  newValue: string = '';
  onKeyEvent() {}
}

describe('BigInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let bigInputDebugElement: DebugElement;
  let inputNativeElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [SharedModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    bigInputDebugElement = fixture.debugElement.childNodes[0] as DebugElement;
    inputNativeElement = fixture.nativeElement.querySelector('input');
  });

  it('should have expected placeholder', () => {
    expect(bigInputDebugElement.attributes['placeholder']).toContain(
      'going to do'
    );
  });

  it('should have updatable value', () => {
    component.newValue = 'abcde';
    fixture.detectChanges();
    expect(inputNativeElement.value).toBe(component.newValue);
  });
});
