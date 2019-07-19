import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCenterDesktopComponent } from './message-center-desktop.component';

describe('MessageCenterDesktopComponent', () => {
  let component: MessageCenterDesktopComponent;
  let fixture: ComponentFixture<MessageCenterDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCenterDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCenterDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
