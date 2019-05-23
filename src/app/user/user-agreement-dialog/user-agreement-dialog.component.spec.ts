import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgreementDialogComponent } from './user-agreement-dialog.component';

describe('UserAgreementDialogComponent', () => {
  let component: UserAgreementDialogComponent;
  let fixture: ComponentFixture<UserAgreementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgreementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgreementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
