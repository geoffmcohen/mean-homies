import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationViewMobileComponent } from './conversation-view-mobile.component';

describe('ConversationViewMobileComponent', () => {
  let component: ConversationViewMobileComponent;
  let fixture: ComponentFixture<ConversationViewMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationViewMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationViewMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
