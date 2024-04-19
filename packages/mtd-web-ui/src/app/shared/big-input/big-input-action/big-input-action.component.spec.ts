import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared.module';

@Component({
  selector: 'mtd-host-for-test',
  template: '',
})
class HostComponent {
  actionHandler = () => {};
}

describe('BigInputActionComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  const getButton = () => fixture.debugElement.query(By.css('button'));
  const getIcon = () => fixture.debugElement.query(By.css('mat-icon'));

  function createHostComponent(
    template: string
  ): ComponentFixture<HostComponent> {
    TestBed.overrideComponent(HostComponent, { set: { template: template } });
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [SharedModule, NoopAnimationsModule],
    })
  );

  it('should be created', () => {
    const template = '<mtd-big-input-action></mtd-big-input-action>';
    fixture = createHostComponent(template);
    expect(component).toBeTruthy();
  });

  it('should initially not be disabled and show no icon or label', () => {
    const template = '<mtd-big-input-action></mtd-big-input-action>';
    fixture = createHostComponent(template);
    expect(getButton().nativeElement.disabled).toBeFalsy();
    expect(getIcon()).toBeNull();
  });

  it('should disable button if disabled property is set', () => {
    const template =
      '<mtd-big-input-action [disabled]="true"></mtd-big-input-action>';
    fixture = createHostComponent(template);
    expect(getButton().nativeElement.disabled).toBeTruthy();
  });

  it('should display icon if fontSet and fontIcon properties are set', () => {
    const template = `<mtd-big-input-action fontSet="fas" fontIcon="fa-trash"></mtd-big-input-action>`;
    fixture = createHostComponent(template);
    expect(getIcon()).toBeTruthy();
    expect(getIcon().nativeElement.classList.contains('fa-trash')).toBeTruthy();
    expect(getIcon().nativeElement.classList.contains('fas')).toBeTruthy();
  });
});
