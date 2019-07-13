import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDialogMobileComponent } from './signup-dialog-mobile.component';

describe('SignupDialogMobileComponent', () => {
  let component: SignupDialogMobileComponent;
  let fixture: ComponentFixture<SignupDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
