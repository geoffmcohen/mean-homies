import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDialogMobileComponent } from './reset-password-dialog-mobile.component';

describe('ResetPasswordDialogMobileComponent', () => {
  let component: ResetPasswordDialogMobileComponent;
  let fixture: ComponentFixture<ResetPasswordDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
