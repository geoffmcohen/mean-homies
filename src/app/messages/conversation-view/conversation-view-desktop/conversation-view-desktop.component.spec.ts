import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationViewDesktopComponent } from './conversation-view-desktop.component';

describe('ConversationViewDesktopComponent', () => {
  let component: ConversationViewDesktopComponent;
  let fixture: ComponentFixture<ConversationViewDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationViewDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationViewDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
