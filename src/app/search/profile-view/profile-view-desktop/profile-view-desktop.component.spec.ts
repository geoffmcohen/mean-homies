import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewDesktopComponent } from './profile-view-desktop.component';

describe('ProfileViewDesktopComponent', () => {
  let component: ProfileViewDesktopComponent;
  let fixture: ComponentFixture<ProfileViewDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
