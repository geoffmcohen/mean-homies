import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieViewDesktopComponent } from './homie-view-desktop.component';

describe('HomieViewDesktopComponent', () => {
  let component: HomieViewDesktopComponent;
  let fixture: ComponentFixture<HomieViewDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomieViewDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomieViewDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
