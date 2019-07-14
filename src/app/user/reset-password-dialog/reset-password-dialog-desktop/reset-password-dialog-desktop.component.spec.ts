import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDialogDesktopComponent } from './reset-password-dialog-desktop.component';

describe('ResetPasswordDialogDesktopComponent', () => {
  let component: ResetPasswordDialogDesktopComponent;
  let fixture: ComponentFixture<ResetPasswordDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
