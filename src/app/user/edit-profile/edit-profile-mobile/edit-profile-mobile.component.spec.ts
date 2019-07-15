import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileMobileComponent } from './edit-profile-mobile.component';

describe('EditProfileMobileComponent', () => {
  let component: EditProfileMobileComponent;
  let fixture: ComponentFixture<EditProfileMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfileMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
