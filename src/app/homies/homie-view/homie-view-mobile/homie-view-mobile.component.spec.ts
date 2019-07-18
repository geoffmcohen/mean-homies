import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieViewMobileComponent } from './homie-view-mobile.component';

describe('HomieViewMobileComponent', () => {
  let component: HomieViewMobileComponent;
  let fixture: ComponentFixture<HomieViewMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomieViewMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomieViewMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
