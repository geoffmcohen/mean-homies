import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileDesktopComponent } from './edit-profile-desktop.component';

describe('EditProfileDesktopComponent', () => {
  let component: EditProfileDesktopComponent;
  let fixture: ComponentFixture<EditProfileDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfileDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
