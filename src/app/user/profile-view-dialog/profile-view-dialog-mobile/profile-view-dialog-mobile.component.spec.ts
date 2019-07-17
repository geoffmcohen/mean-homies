import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewDialogMobileComponent } from './profile-view-dialog-mobile.component';

describe('ProfileViewDialogMobileComponent', () => {
  let component: ProfileViewDialogMobileComponent;
  let fixture: ComponentFixture<ProfileViewDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
