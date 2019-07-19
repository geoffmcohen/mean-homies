import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCenterMobileComponent } from './message-center-mobile.component';

describe('MessageCenterMobileComponent', () => {
  let component: MessageCenterMobileComponent;
  let fixture: ComponentFixture<MessageCenterMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCenterMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCenterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
