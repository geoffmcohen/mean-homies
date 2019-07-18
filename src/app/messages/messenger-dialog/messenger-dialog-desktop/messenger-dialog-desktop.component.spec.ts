import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerDialogDesktopComponent } from './messenger-dialog-desktop.component';

describe('MessengerDialogDesktopComponent', () => {
  let component: MessengerDialogDesktopComponent;
  let fixture: ComponentFixture<MessengerDialogDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerDialogDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerDialogDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
