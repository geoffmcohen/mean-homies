import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogDesktopComponent } from './login-dialog-desktop.component';

describe('LoginDialogDesktopComponent', () => {
  let component: LoginDialogDesktopComponent;
  let fixture: ComponentFixture<LoginDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
