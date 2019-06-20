import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewDialogComponent } from './profile-view-dialog.component';

describe('ProfileViewDialogComponent', () => {
  let component: ProfileViewDialogComponent;
  let fixture: ComponentFixture<ProfileViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
