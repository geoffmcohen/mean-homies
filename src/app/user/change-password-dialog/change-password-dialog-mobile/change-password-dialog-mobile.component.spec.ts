import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDialogMobileComponent } from './change-password-dialog-mobile.component';

describe('ChangePasswordDialogMobileComponent', () => {
  let component: ChangePasswordDialogMobileComponent;
  let fixture: ComponentFixture<ChangePasswordDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
