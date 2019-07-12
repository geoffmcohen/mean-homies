import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgreementDialogDesktopComponent } from './user-agreement-dialog-desktop.component';

describe('UserAgreementDialogDesktopComponent', () => {
  let component: UserAgreementDialogDesktopComponent;
  let fixture: ComponentFixture<UserAgreementDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgreementDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgreementDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
