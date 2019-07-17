import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieRequestMobileComponent } from './homie-request-mobile.component';

describe('HomieRequestMobileComponent', () => {
  let component: HomieRequestMobileComponent;
  let fixture: ComponentFixture<HomieRequestMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomieRequestMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomieRequestMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
