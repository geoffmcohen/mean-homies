import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDialogDesktopComponent } from './change-password-dialog-desktop.component';

describe('ChangePasswordDialogDesktopComponent', () => {
  let component: ChangePasswordDialogDesktopComponent;
  let fixture: ComponentFixture<ChangePasswordDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
