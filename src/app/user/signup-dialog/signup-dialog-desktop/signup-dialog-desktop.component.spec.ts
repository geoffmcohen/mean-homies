import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDialogDesktopComponent } from './signup-dialog-desktop.component';

describe('SignupDialogDesktopComponent', () => {
  let component: SignupDialogDesktopComponent;
  let fixture: ComponentFixture<SignupDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
