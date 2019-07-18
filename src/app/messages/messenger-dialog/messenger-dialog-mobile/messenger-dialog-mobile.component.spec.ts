import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerDialogMobileComponent } from './messenger-dialog-mobile.component';

describe('MessengerDialogMobileComponent', () => {
  let component: MessengerDialogMobileComponent;
  let fixture: ComponentFixture<MessengerDialogMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerDialogMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerDialogMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
