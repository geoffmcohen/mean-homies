import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomiesMobileComponent } from './homies-mobile.component';

describe('HomiesMobileComponent', () => {
  let component: HomiesMobileComponent;
  let fixture: ComponentFixture<HomiesMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomiesMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomiesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
