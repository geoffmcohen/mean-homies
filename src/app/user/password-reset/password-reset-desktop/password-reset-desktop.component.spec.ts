import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetDesktopComponent } from './password-reset-desktop.component';

describe('PasswordResetDesktopComponent', () => {
  let component: PasswordResetDesktopComponent;
  let fixture: ComponentFixture<PasswordResetDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
