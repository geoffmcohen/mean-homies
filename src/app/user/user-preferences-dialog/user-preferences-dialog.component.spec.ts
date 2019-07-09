import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesDialogComponent } from './user-preferences-dialog.component';

describe('UserPreferencesDialogComponent', () => {
  let component: UserPreferencesDialogComponent;
  let fixture: ComponentFixture<UserPreferencesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPreferencesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
