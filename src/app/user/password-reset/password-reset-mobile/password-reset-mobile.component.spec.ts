import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetMobileComponent } from './password-reset-mobile.component';

describe('PasswordResetMobileComponent', () => {
  let component: PasswordResetMobileComponent;
  let fixture: ComponentFixture<PasswordResetMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
