import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerDialogComponent } from './messenger-dialog.component';

describe('MessengerDialogComponent', () => {
  let component: MessengerDialogComponent;
  let fixture: ComponentFixture<MessengerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
