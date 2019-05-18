import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserAreaComponent } from './home-user-area.component';

describe('HomeUserAreaComponent', () => {
  let component: HomeUserAreaComponent;
  let fixture: ComponentFixture<HomeUserAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeUserAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
