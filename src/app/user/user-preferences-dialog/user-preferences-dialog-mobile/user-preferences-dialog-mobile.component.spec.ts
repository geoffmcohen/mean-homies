import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesDialogMobileComponent } from './user-preferences-dialog-mobile.component';

describe('UserPreferencesDialogMobileComponent', () => {
  let component: UserPreferencesDialogMobileComponent;
  let fixture: ComponentFixture<UserPreferencesDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPreferencesDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
