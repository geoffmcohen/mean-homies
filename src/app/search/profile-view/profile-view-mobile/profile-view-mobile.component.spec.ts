import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewMobileComponent } from './profile-view-mobile.component';

describe('ProfileViewMobileComponent', () => {
  let component: ProfileViewMobileComponent;
  let fixture: ComponentFixture<ProfileViewMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
