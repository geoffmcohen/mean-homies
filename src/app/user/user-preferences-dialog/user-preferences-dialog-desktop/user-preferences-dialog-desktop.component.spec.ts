import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesDialogDesktopComponent } from './user-preferences-dialog-desktop.component';

describe('UserPreferencesDialogDesktopComponent', () => {
  let component: UserPreferencesDialogDesktopComponent;
  let fixture: ComponentFixture<UserPreferencesDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPreferencesDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
