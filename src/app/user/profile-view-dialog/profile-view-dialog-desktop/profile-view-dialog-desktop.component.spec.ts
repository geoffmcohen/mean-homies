import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewDialogDesktopComponent } from './profile-view-dialog-desktop.component';

describe('ProfileViewDialogDesktopComponent', () => {
  let component: ProfileViewDialogDesktopComponent;
  let fixture: ComponentFixture<ProfileViewDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
