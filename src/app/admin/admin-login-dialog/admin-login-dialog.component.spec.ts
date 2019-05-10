import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginDialogComponent } from './admin-login-dialog.component';

describe('AdminLoginDialogComponent', () => {
  let component: AdminLoginDialogComponent;
  let fixture: ComponentFixture<AdminLoginDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLoginDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
