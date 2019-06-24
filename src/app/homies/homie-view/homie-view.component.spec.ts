import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieViewComponent } from './homie-view.component';

describe('HomieViewComponent', () => {
  let component: HomieViewComponent;
  let fixture: ComponentFixture<HomieViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomieViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomieViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
