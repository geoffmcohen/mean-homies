import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserAreaComponent } from './admin-user-area.component';

describe('AdminUserAreaComponent', () => {
  let component: AdminUserAreaComponent;
  let fixture: ComponentFixture<AdminUserAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
