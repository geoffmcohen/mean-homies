import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomieRequestComponent } from './homie-request.component';

describe('HomieRequestComponent', () => {
  let component: HomieRequestComponent;
  let fixture: ComponentFixture<HomieRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomieRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomieRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
