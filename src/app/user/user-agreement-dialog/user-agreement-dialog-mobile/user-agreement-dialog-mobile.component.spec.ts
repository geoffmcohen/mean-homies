import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgreementDialogMobileComponent } from './user-agreement-dialog-mobile.component';

describe('UserAgreementDialogMobileComponent', () => {
  let component: UserAgreementDialogMobileComponent;
  let fixture: ComponentFixture<UserAgreementDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgreementDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgreementDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
