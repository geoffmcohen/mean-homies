import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomiesComponent } from './homies.component';

describe('HomiesComponent', () => {
  let component: HomiesComponent;
  let fixture: ComponentFixture<HomiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
