import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableFeatureComponent } from './unavailable-feature.component';

describe('UnavailableFeatureComponent', () => {
  let component: UnavailableFeatureComponent;
  let fixture: ComponentFixture<UnavailableFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnavailableFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnavailableFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
