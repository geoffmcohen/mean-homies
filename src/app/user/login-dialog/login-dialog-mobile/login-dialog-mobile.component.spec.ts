import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogMobileComponent } from './login-dialog-mobile.component';

describe('LoginDialogMobileComponent', () => {
  let component: LoginDialogMobileComponent;
  let fixture: ComponentFixture<LoginDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
